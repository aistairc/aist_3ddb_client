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
import type { FeatureProperties } from "@/types";
import { API_DATA_DIR } from "@/modules/api";
import { FolderArrowDownIcon } from "@heroicons/vue/24/solid";

const props = defineProps<{ featProps: FeatureProperties }>();

const downloadFeature = (featProps: FeatureProperties) => {
  if (!featProps.downloadable) return;
  const url = `${API_DATA_DIR}${featProps.reg_id}`;
  location.href = url;
};
</script>

<template>
  <div class="p-4 max-w-sm">
    <div class="flex justify-center items-center gap-x-2 mb-3">
      <div class="text-sm font-bold break-all">
        {{ props.featProps.title }}
      </div>
      <div v-if="props.featProps.downloadable">
        <FolderArrowDownIcon
          @click="downloadFeature(props.featProps)"
          class="h-6 w-6 text-slate-600 hover:opacity-75 cursor-pointer"
        />
      </div>
    </div>

    <div class="text-xs text-slate-600">
      <table class="table-auto">
        <tbody>
          <tr>
            <th class="text-left">場所</th>
            <td>{{ props.featProps.location }}</td>
          </tr>
          <tr>
            <th class="text-left">作成者</th>
            <td>{{ props.featProps.author }}</td>
          </tr>
          <tr>
            <th class="text-left">作成日</th>
            <td>{{ props.featProps.creation_date }}</td>
          </tr>
          <tr>
            <th class="text-left whitespace-nowrap">ライセンス</th>
            <td class="break-all">{{ props.featProps.license }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="text-xs text-slate-600 break-all mx-2"
      v-if="props.featProps.description"
    >
      {{ props.featProps.description }}
    </div>
  </div>
</template>
