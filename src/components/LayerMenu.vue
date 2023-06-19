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
import { ref, onMounted, inject } from "vue";
import centerOfMass from "@turf/center-of-mass";
import {
  PlusCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/24/solid";
import { searchFeatures, SERVICES } from "@/modules/api";
import {
  getGeoidHeight,
  GEOID_GEOTIFF_PATH,
} from "@/modules/utils";
import type { Feature, CesiumLayer } from "@/types";
import { fromBlob } from "geotiff";
import type GeoTIFF from "geotiff";
import InfoPopup from "./InfoPopup.vue";

const props = defineProps<{
  selectedLayers: CesiumLayer[];
  addLayer: (layer: CesiumLayer, doFlyTo: boolean) => void;
  removeLayer: (layer: CesiumLayer) => void;
  flyToLayer: (layer: CesiumLayer) => void;
  getViewerWKTPolygon: () => string | undefined;
}>();

const openAboutModal = inject("openAboutModal");

const services = SERVICES;
const selectedService = ref("ALL");
const searchText = ref("");
const resultCount = ref<number | undefined>();
const resultFeatures = ref<Feature[]>([]);

let geoidTIFF: GeoTIFF | undefined = undefined;
onMounted(async () => {
  const response = await fetch(GEOID_GEOTIFF_PATH);
  const blob = await response.blob();
  geoidTIFF = await fromBlob(blob);
});

const search = async (areaOnly: boolean = false) => {
  resultCount.value = undefined;
  resultFeatures.value.splice(0);

  let areaWKT: undefined | string = undefined;
  if (areaOnly) {
    areaWKT = props.getViewerWKTPolygon();
    if (areaWKT === undefined) return;
  }

  try {
    const featureCollection = await searchFeatures(
      selectedService.value,
      searchText.value,
      areaWKT
    );
    resultCount.value = featureCollection.properties.all;
    featureCollection.features.forEach((d) => {
      resultFeatures.value.push(d);
    });
  } catch (error) {
    resultCount.value = 0;
  }
};

const addFeature = async (feat: Feature, doFlyTo = true) => {
  // 選択済みの地物は、再度追加しない
  const existingLayer = props.selectedLayers.find(
    (d) => d.properties.id === feat.properties.reg_id
  );
  if (existingLayer !== undefined) {
    // 移動のみ実施
    if (doFlyTo) props.flyToLayer(existingLayer);
    return;
  }

  // 地物の中心点
  const centerCoordinate = centerOfMass(feat).geometry.coordinates;
  const center = {
    longitude: centerCoordinate[0],
    latitude: centerCoordinate[1],
  };

  // 地物のジオイド高
  const geoidHeight =
    geoidTIFF === undefined
      ? 0
      : await getGeoidHeight(geoidTIFF, center.latitude, center.longitude);

  const layer: CesiumLayer = {
    properties: {
      id: feat.properties.reg_id,
      offsetHeight: geoidHeight * -1,
      center,
      name: feat.properties.title,
      url: feat.properties["3dtiles_url"],
      attribution: feat.properties.author,
      tileStyle: { pointSize: 2 },
    },
    instances: [],
  };

  props.addLayer(layer, doFlyTo);
};
</script>

<template>
  <div class="flex flex-col h-full">
    <header class="py-4 flex items-center justify-center gap-x-4">
      <div class="text-md font-bold leading-5 text-center ml-8 text-slate-600">
        AIST 3DDB Client
      </div>
      <QuestionMarkCircleIcon
        @click="openAboutModal"
        class="h-6 w-6 text-slate-600 hover:opacity-75 cursor-pointer"
      />
    </header>

    <input
      v-model="searchText"
      placeholder="空欄で全て表示 ..."
      class="border-2 p-2 mx-2 text-sm rounded-lg"
    />

    <div class="flex flex-col gap-y-2">
      <div class="flex justify-evenly py-2">
        <select
          name="services"
          id="service-select"
          v-model="selectedService"
          class="text-sm"
        >
          <option
            v-for="(service, idx) in services"
            :key="idx"
            :value="service.name"
          >
            {{ service.description }}
          </option>
        </select>

        <button
          @click="search()"
          class="text-sm rounded-lg bg-slate-200 px-3 py-1"
        >
          検索
        </button>

        <button
          @click="search(true)"
          class="text-sm rounded-lg bg-slate-200 px-3 py-1"
        >
          検索<span class="text-xs">（表示領域内）</span>
        </button>
      </div>
    </div>

    <div v-if="resultCount !== undefined" class="text-sm my-2 text-center">
      {{ resultCount }} 件
    </div>

    <div class="scrollbar gap-y-2 overflow-y-auto flex-grow basis-0 shrink">
      <div
        v-for="(feat, idx) in resultFeatures"
        :key="idx"
        class="p-2 rounded text-slate-800 flex justify-between items-center gap-x-2 border-2 border-transparent hover:border-slate-500"
      >
        <div>
          <div class="text-sm break-all">{{ feat.properties.title }}</div>
          <div class="text-xs text-slate-600 break-all">
            {{ feat.properties.creation_date }}, {{ feat.properties.location }},
            {{ feat.properties.author }}
          </div>
        </div>
        <div class="flex items-center gap-x-1">
          <div>
            <VDropdown>
              <InformationCircleIcon
                class="h-6 w-6 text-slate-600 hover:opacity-75 cursor-pointer"
              />
              <template #popper
                ><InfoPopup :featProps="feat.properties"
              /></template>
            </VDropdown>
          </div>
          <div>
            <PlusCircleIcon
              @click="addFeature(feat)"
              class="h-6 w-6 text-slate-600 hover:opacity-75 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* スクロールバーカスタマイズ */
.scrollbar {
  -webkit-overflow-scrolling: touch;
}

.scrollbar::-webkit-scrollbar {
  width: 0.5rem;
  border-radius: 3px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #475569;
}
</style>
