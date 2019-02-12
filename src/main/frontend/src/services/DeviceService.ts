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

import { autoinject } from "aurelia-framework";

import { format } from "date-fns";
import { ApiClient } from "Helpers/ApiClient";
import { LogBuilder } from "Helpers/LogBuilder";
import { Device, TKAQDataPoint } from "Models/Device";
export { Device } from "Models/Device";

const Log = LogBuilder.create("Device service");

export * from "Models/Device";
export { BadRequestError, ForbiddenError, ConflictError } from "Helpers/ResponseHandler";

export interface DeviceMessage {
  payload: string;
  port: number;
}

@autoinject
export class DeviceService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Fetches all devices available
   */
  fetchDevices(): Promise<Device[]> {
    return this.apiClient.http
      .get(`/devices`)
      .then((data) => {
        return JSON.parse(data.content).devices;
      })
      .then((devices) => {
        return devices.map(Device.newFromDto);
      });
  }

  /**
   * Fetches a device by IMEI
   * @param imei IMEI of device
   */
  fetchDeviceByImei(imei: string): Promise<Device> {
    return this.apiClient.http
      .get(`/devices/${imei}`)
      .then((data) => {
        return JSON.parse(data.content);
      })
      .then((device) => {
        Log.debug("Fetched device ", device);
        return Device.newFromDto(device);
      });
  }

  fetchCollectionDevices(id: string): Promise<Device[]> {
    return this.apiClient.http
      .get(`/collections/${id}/devices`)
      .then((data) => data.content)
      .then((deviceDtoList) => deviceDtoList.map((deviceDto) => Device.newFromDto(deviceDto)));
  }

  fetchDeviceInCollection(collectionId: string, deviceId: string): Promise<Device> {
    return this.apiClient.http
      .get(`/collections/${collectionId}/devices/${deviceId}`)
      .then((data) => data.content)
      .then((deviceDto) => Device.newFromDto(deviceDto));
  }

  /**
   * Fetches device data
   * @param {Device} device The device which the data will be fetched for
   * @param {DataSearchParameters} searchParams Search parameters for getting data
   */
  fetchDeviceData(
    device: Device,
    { limit = null, since = null, until = null }: DataSearchParameters = {},
  ): Promise<TKAQDataPoint[]> {
    return this.apiClient.http
      .get(
        `/collections/${device.collectionId}/devices/${device.id}/data?` +
          `${limit ? "limit=" + limit : ""}` +
          `${since ? "&since=" + format(since, "T") : ""}`,
        `${until ? "&until=" + format(until, "T") : ""}`,
      )
      .then((data) => {
        return data.content.messages;
      })
      .then((messages: TKAQDataPoint[] = []) => {
        return messages.sort((a, b) => {
          return b.timestamp - a.timestamp;
        });
      });
  }

  createNewDevice(device: Device): Promise<Device> {
    return this.apiClient.http
      .post(`/collections/${device.collectionId}/devices`, device)
      .then((data) => data.content)
      .then((deviceDto) => Device.newFromDto(deviceDto));
  }

  updateDevice(device: Device): Promise<Device> {
    return this.apiClient.http
      .patch(`/collections/${device.collectionId}/devices/${device.id}`, device)
      .then((data) => data.content)
      .then((deviceDto) => Device.newFromDto(deviceDto));
  }

  deletedevice(device: Device): Promise<any> {
    return this.apiClient.http.delete(`/collections/${device.collectionId}/devices/${device.id}`);
  }

  addTagToDevice(device: Device, tag: Tag): Promise<TagObject> {
    const tagObject = {};
    tagObject[tag.key] = tag.value;

    return this.apiClient.http
      .patch(`/collections/${device.collectionId}/devices/${device.id}/tags`, tagObject)
      .then((data) => data.content);
  }

  removeTagFromDevice(device: Device, tagName: string): Promise<TagObject> {
    return this.apiClient.http
      .delete(`/collections/${device.collectionId}/devices/${device.id}/tags/${tagName}`)
      .then((data) => data.content);
  }

  sendMessageToDevice(message: DeviceMessage, device: Device): Promise<any> {
    return this.apiClient.http.post(
      `/collections/${device.collectionId}/devices/${device.id}/to`,
      message,
    );
  }

  fetchDeviceMessagesById(
    collectionId: string,
    deviceId: string,
    { limit = 256, since = null, until = null }: DataSearchParameters = {},
    sort: boolean = false,
  ): Promise<TKAQDataPoint[]> {
    return this.apiClient.http
      .get(
        `/collections/${collectionId}/devices/${deviceId}/data?` +
          `${limit ? "limit=" + limit : ""}` +
          `${since ? "&since=" + format(since, "T") : ""}` +
          `${until ? "&until=" + format(until, "T") : ""}`,
      )
      .then((data) => {
        return data.content;
      })
      .then((messages: TKAQDataPoint[] = []) => {
        if (sort) {
          return messages.sort((a, b) => {
            return a.timestamp - b.timestamp;
          });
        } else {
          return messages;
        }
      });
  }
}
