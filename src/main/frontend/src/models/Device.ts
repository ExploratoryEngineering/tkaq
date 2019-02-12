/*
	Copyright 2019 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

export interface DeviceDto {
  id: string;
  collectionId: string;
  imei: string;
  imsi: string;
  tags: { [tagName: string]: string };
}

export interface TKAQDataPoint {
  altitude: number;
  co2Equivalents: number;
  collectionId: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  payload: string;
  pm10: number;
  pm25: number;
  relHumidity: number;
  temperature: number;
  time: number;
  timestamp: number;
  vocEquivalents: number;
}

export class Device implements TagEntity {
  static newFromDto(device: DeviceDto): Device {
    return new Device({
      id: device.id,
      collectionId: device.collectionId,
      imei: device.imei,
      imsi: device.imsi,
      tags: device.tags,
    });
  }

  static toDto(device: Device): DeviceDto {
    return {
      id: device.id,
      collectionId: device.collectionId,
      imei: device.imei,
      imsi: device.imsi,
      tags: device.tags,
    };
  }

  id: string;
  collectionId: string;
  imei: string;
  imsi: string;
  tags: { [tagName: string]: string };

  constructor({ id = "", collectionId = "", imei = "", imsi = "", tags = {} } = {}) {
    this.id = id;
    this.collectionId = collectionId;
    this.imei = imei;
    this.imsi = imsi;
    this.tags = tags;
  }
}
