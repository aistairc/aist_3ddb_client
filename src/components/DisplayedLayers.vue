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
import { MinusCircleIcon } from "@heroicons/vue/24/solid";
import type { CesiumLayer } from "@/types";

const props = defineProps<{
  selectedLayers: CesiumLayer[];
  addLayer: (layer: CesiumLayer, doFlyTo: boolean) => void;
  removeLayer: (layer: CesiumLayer) => void;
  flyToLayer: (layer: CesiumLayer) => void;
}>();

const removeFeature = (layer: CesiumLayer) => {
  props.removeLayer(layer);
};

const flyToFeature = (layer: CesiumLayer) => {
  props.flyToLayer(layer);
};
</script>

<template>
  <div
    class="scrollbar flex flex-col gap-y-2 overflow-y-auto h-auto max-h-[calc(100vh_-_4rem)] pr-1"
  >
    <div
      v-for="(layer, idx) in props.selectedLayers"
      :key="idx"
      class="p-2 rounded text-slate-50 bg-slate-600 flex justify-between items-center gap-x-2 cursor-pointer border-2 border-transparent hover:border-red-400 shadow-2xl"
      @click="flyToFeature(layer)"
    >
      <div class="text-sm">{{ layer.properties.name }}</div>
      <div class="icon">
        <MinusCircleIcon
          @click="removeFeature(layer)"
          class="h-6 w-6 text-slate-50 hover:opacity-75 cursor-pointer"
        />
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
  background: #475569;
  border-radius: 3px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #f8fafc;
}
</style>
