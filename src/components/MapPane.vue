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
import { onMounted, ref, computed, isProxy, toRaw } from "vue";
import {
  Viewer,
  UrlTemplateImageryProvider,
  Cartesian3,
  Cesium3DTileset,
  Cesium3DTileStyle,
  Cartesian2,
  Cartographic,
  Math as CesiumMath,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import type { CesiumLayer } from "@/types";
import {
  setOffsetHeightToTileset,
  CESIUM_INITIAL_OPTIONS,
} from "@/modules/utils";
import GsiTerrainProvider from "@/modules/gsiTerrain";

(window as any).CESIUM_BASE_URL = import.meta.env.BASE_URL
  ? import.meta.env.BASE_URL : "/";

let viewer: Viewer | null = null;

const attributions = ref<string[]>([
  `<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>`,
]);
const attributionHtml = computed(() => {
  return [...new Set(attributions.value)].join(" | ");
});

const gsiSeamless = new UrlTemplateImageryProvider({
  url: "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
});
gsiSeamless.defaultContrast = 0.8;

onMounted(() => {
  viewer = new Viewer("cesium-container", {
    ...CESIUM_INITIAL_OPTIONS,
    imageryProvider: gsiSeamless,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    terrainProvider: new GsiTerrainProvider({}),
    targetFrameRate: 60,
  });

  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(139.76, 35.66, 600), // 初期位置: 東京
    orientation: {
      heading: 0, // 水平方向の回転度（ラジアン）
      pitch: -0.75, // 垂直方向の回転度（ラジアン）
      roll: 0,
    },
  });

  // 地形の3D的前後関係を考慮
  viewer.scene.globe.depthTestAgainstTerrain = true;

  // Cesiumアイコンなどを非表示
  viewer.cesiumWidget.creditContainer.remove();
});

const add = async (layer: CesiumLayer, doFlyTo = true) => {
  if (viewer === null) return;

  attributions.value.push(layer.properties.attribution);

  const instance: Cesium3DTileset = viewer.scene.primitives.add(
    new Cesium3DTileset({ url: layer.properties.url })
  );
  await instance.readyPromise;
  if (layer.properties.offsetHeight) {
    setOffsetHeightToTileset(instance, layer.properties.offsetHeight);
  }
  if (layer.properties.tileStyle) {
    instance.style = new Cesium3DTileStyle(layer.properties.tileStyle);
  }
  layer.instances.push(instance);

  if (doFlyTo) flyTo(layer);
};

const remove = (layer: CesiumLayer) => {
  if (viewer === null) return;

  attributions.value.splice(
    attributions.value.indexOf(layer.properties.attribution),
    1
  );

  layer.instances.forEach((instance) => {
    if (isProxy(instance)) instance = toRaw(instance);
    viewer!.scene.primitives.remove(instance);
  });
  layer.instances = [];
};

const flyTo = async (layer: CesiumLayer) => {
  if (viewer === null) return;

  if (layer.instances.length > 0) viewer.flyTo(layer.instances[0]);
};

const getViewerWKTPolygon = (): string | undefined => {
  if (viewer === null) return;

  // Top Left
  const cTL = viewerCoordsToCartographicCoords(0, 0);
  // Top Right
  const cTR = viewerCoordsToCartographicCoords(viewer.canvas.width, 0);
  // Bottom Right
  const cBR = viewerCoordsToCartographicCoords(
    viewer.canvas.width,
    viewer.canvas.height
  );
  // Bottom Left
  const cBL = viewerCoordsToCartographicCoords(0, viewer.canvas.height);

  if (
    cTL === undefined ||
    cTR === undefined ||
    cBR === undefined ||
    cBL === undefined
  ) {
    alert(
      "表示領域を取得できませんでした。\n地平線（上空）が画面に入らないよう、視点を移動してください。"
    );
    return;
  }

  const wkt =
    "POLYGON((" +
    `${cTL.longitude} ${cTL.latitude},` +
    `${cTR.longitude} ${cTR.latitude},` +
    `${cBR.longitude} ${cBR.latitude},` +
    `${cBL.longitude} ${cBL.latitude},` +
    `${cTL.longitude} ${cTL.latitude}` +
    "))";
  return wkt;
};

const viewerCoordsToCartographicCoords = (x: number, y: number) => {
  if (viewer === null) return;

  const ray = viewer.camera.getPickRay(new Cartesian2(x, y));
  if (ray == undefined) return;

  const cartesian3 = viewer.scene.globe.pick(ray, viewer.scene);
  if (cartesian3 == undefined) return;

  const cartographic = Cartographic.fromCartesian(cartesian3);
  const latitude = CesiumMath.toDegrees(cartographic.latitude);
  const longitude = CesiumMath.toDegrees(cartographic.longitude);
  const height = cartographic.height;
  return {
    latitude,
    longitude,
    height,
  };
};

defineExpose({
  add,
  remove,
  flyTo,
  getViewerWKTPolygon,
});
</script>

<template>
  <div>
    <div id="cesium-container" class="h-screen"></div>
    <div
      id="attribution"
      class="z-10 absolute right-0 bottom-0 text-sm text-black/50 bg-white/75 p-0.5"
      v-html="attributionHtml"
    ></div>
  </div>
</template>

<style scoped></style>
