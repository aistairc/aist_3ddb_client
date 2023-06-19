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
import type { Service, FeatureCollection } from "@/types";

const API_ROOT = "https://gsrt.digiarc.aist.go.jp/3ddb_demo";

const API_DATA_DIR = `${API_ROOT}/api/v1/zipdata/`;

const SERVICES: Service[] = [
  {
    id: 1002,
    name: "ALL",
    type: "ALL",
    description: "全て",
  },
  {
    id: 2000,
    name: "POINTCLOUD",
    type: "3D",
    description: "点群",
  },
  {
    id: 2001,
    name: "SURFACE",
    type: "3D",
    description: "Surface",
  },
  {
    id: 2002,
    name: "STRUCTURE",
    type: "3D",
    description: "Structure",
  },
  {
    id: 2003,
    name: "CITYGML",
    type: "3D",
    description: "CityGML",
  },
];

const getServices = async () => {
  const url = API_ROOT + "/api/v1/services";
  const response = await fetch(url);
  const data: { services: Service[] } = await response.json();
  return data;
};

const searchFeatures = async (
  service: string = "ALL",
  searchText: string = "",
  areaWKT: undefined | string = undefined
) => {
  let url =
    API_ROOT + `/api/v1/services/${service}/features?title=${searchText}`;

  if (areaWKT !== undefined) {
    url += `&area=${areaWKT}`;
  }
  const response = await fetch(url);

  if (!response.ok) {
    console.error(
      `Error while fetching features for service '${service}'`,
      response
    );
    throw new Error(response.statusText);
  }

  const featureCollection: FeatureCollection = await response.json();
  return featureCollection;
};

const getFeaturesInArea = async (wkt: string) => {
  const url =
    "https://gsrt.digiarc.aist.go.jp/3ddb_demo" +
    "/api/v1/services/ALL/features" +
    "?area=" +
    wkt;

  const response = await fetch(url);
  const featureCollection: FeatureCollection = await response.json();
  return featureCollection;
};

export {
  getServices,
  searchFeatures,
  getFeaturesInArea,
  API_DATA_DIR,
  SERVICES,
};
