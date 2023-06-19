/*
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
*/
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/aist_3d_client/",
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/cesium/Build/Cesium/Workers",
          dest: "",
        },
        {
          src: "node_modules/cesium/Build/Cesium/ThirdParty",
          dest: "",
        },
        {
          src: "node_modules/cesium/Build/Cesium/Assets",
          dest: "",
        },
        {
          src: "node_modules/cesium/Build/Cesium/Widgets",
          dest: "",
        },
      ],
    }),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
