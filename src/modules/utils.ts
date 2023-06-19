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
import { Cesium3DTileset, Cartographic, Cartesian3, Matrix4 } from "cesium";
import type { GeoTIFF, TypedArray } from "geotiff";

const GEOID_GEOTIFF_PATH = "./proj/jp_gsi_gsigeo2011.tif";

const CESIUM_INITIAL_OPTIONS = {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  homeButton: false,
  geocoder: false,
  infoBox: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  sceneModePicker: false,
};

/**
 * 指定された経緯度のジオイド高をGeoTIFFデータから取得
 * @param latitude
 * @param longitude
 * @returns {number} - ジオイド高
 */
const getGeoidHeight = async (
  geoidTIFF: GeoTIFF,
  latitude: number,
  longitude: number
): Promise<number> => {
  const image = await geoidTIFF.getImage();
  const data = await image.readRasters();
  const [originX, originY] = image.getOrigin();
  const [resolutionX, resolutionY] = image.getResolution();
  const x = Math.round((longitude - originX) / resolutionX);
  const y = Math.round((latitude - originY) / resolutionY);
  const index = y * data.width + x;
  const band1 = data[0] as TypedArray;
  const geoidHeight = band1[index];
  if (geoidHeight === -32768) {
    return 0;
  }
  return geoidHeight;
};

/**
 * 初期読込が完了した(readyPromise)tilesetに対し、高さのオフセットを設定
 * @param tileset
 * @param offsetHeight
 * @returns {Cesium3DTileset} - オフセットが設定されたtileset
 */
const setOffsetHeightToTileset = (
  tileset: Cesium3DTileset,
  offsetHeight: number
): Cesium3DTileset => {
  const cartographic = Cartographic.fromCartesian(
    tileset.boundingSphere.center
  );
  const surface = Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    0.0
  );
  const offset = Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    offsetHeight
  );
  const translation = Cartesian3.subtract(offset, surface, new Cartesian3());
  tileset.modelMatrix = Matrix4.fromTranslation(translation);
  return tileset;
};

export {
  GEOID_GEOTIFF_PATH,
  CESIUM_INITIAL_OPTIONS,
  getGeoidHeight,
  setOffsetHeightToTileset,
};
