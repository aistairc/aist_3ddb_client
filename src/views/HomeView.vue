<!--
@copyright Copyright 2023, National Institute of Advanced Industrial
           Science and Technology (AIST).

@author Digital Architecture Research Center, Geoinformation Service
        Research Team.

        https://www.digiarc.aist.go.jp/en/team/gsvrt/

@license Licensed under the Apache License, Version 2.0 (the "License");
         you may not use this file except in compliance with the License.

         You may obtain a copy of the License at

           http://www.apache.org/licenses/LICENSE-2.0

         Unless required by applicable law or agreed to in writing,
         software distributed under the License is distributed on
         an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
         either express or implied.

         See the License for the specific language governing permissions and
         limitations under the License.
-->
<script setup lang="ts">
import LayerMenu from "@/components/LayerMenu.vue";
import MapPane from "@/components/MapPane.vue";
import DisplayedLayers from "@/components/DisplayedLayers.vue";
import AboutModal from "@/components/AboutModal.vue";
import { ref, provide } from "vue";
import type { CesiumLayer } from "@/types";

const selectedLayers = ref<CesiumLayer[]>([]);
const mapPaneRef = ref();
const aboutModalRef = ref();

const addLayer = (layer: CesiumLayer, doFlyTo = true) => {
  selectedLayers.value.push(layer);
  mapPaneRef.value.add(layer, doFlyTo);
};
const removeLayer = (layer: CesiumLayer) => {
  const index = selectedLayers.value.indexOf(layer);
  if (index === -1) return;

  selectedLayers.value.splice(index, 1);
  mapPaneRef.value.remove(layer);
};
const flyToLayer = (layer: CesiumLayer) => {
  mapPaneRef.value.flyTo(layer);
};
const getViewerWKTPolygon = () => {
  return mapPaneRef.value.getViewerWKTPolygon();
};

const openAboutModal = () => {
  aboutModalRef.value.openAboutModal();
};

provide("openAboutModal", openAboutModal);
</script>

<template>
  <main>
    <AboutModal ref="aboutModalRef" />
    <div id="container" class="flex">
      <div id="layer-menu-container" class="w-80 px-2">
        <LayerMenu
          :selectedLayers="selectedLayers"
          :addLayer="addLayer"
          :removeLayer="removeLayer"
          :flyToLayer="flyToLayer"
          :getViewerWKTPolygon="getViewerWKTPolygon"
        />
      </div>
      <div class="z-10 absolute top-4 left-80 ml-6 h-auto w-80">
        <DisplayedLayers
          :selectedLayers="selectedLayers"
          :addLayer="addLayer"
          :removeLayer="removeLayer"
          :flyToLayer="flyToLayer"
        />
      </div>
      <div id="map-pane-container" class="w-[calc(100vw-20rem)]">
        <MapPane ref="mapPaneRef" />
      </div>
    </div>
  </main>
</template>
