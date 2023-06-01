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
import type { GeometryCollection } from "geojson";

/* AIST API */

type Service = {
  id: number;
  name: string;
  type: "2D" | "3D" | "ALL";
  description: string;
};

type FeatureCollection = {
  type: "FeatureCollection";
  properties: {
    all: number;
    num: number;
  };
  features: Feature[];
};

type FeatureProperties = {
  reg_id: number;
  service_name: "LAS" | "OBJ" | "FBX" | "CITYGML" | "CSV";
  creation_date: string;
  creation_date_end: string;
  title: string;
  location: string;
  group: string;
  license: string;
  description: string;
  "3dtiles_url": string;
  downloadable: boolean;
  author: string;
  external_link: string;
  external_link_type: string;
};

type Feature = GeometryCollection & {
  properties: FeatureProperties;
};

/* Cesium */

type CesiumLayerProperties = {
  id: number;
  name: string;
  url: string;
  attribution: string;
  center: {
    longitude: number;
    latitude: number;
  };
  offsetHeight: number;
  tileStyle?: {
    pointSize: number;
  };
};

type CesiumLayer = {
  properties: CesiumLayerProperties;
  instances: any[];
};

export type {
  Service,
  FeatureCollection,
  Feature,
  FeatureProperties,
  CesiumLayer,
};
