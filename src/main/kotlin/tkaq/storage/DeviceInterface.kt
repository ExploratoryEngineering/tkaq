package tkaq.storage

import tkaq.models.Device

interface DeviceInterface {
    fun addDevice(id: String, collectionId: String, tags: Map<String, String>)
    fun retrieveDeviceById(id: String): Device
    fun deleteDeviceById(id: String)
}

