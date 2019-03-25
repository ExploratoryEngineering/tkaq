package tkaq.models

data class Device(val id: String, val collectionId: String, val imei: String, val imsi: String, val tags: Map<String, String>) {
    companion object {
        fun fromDto(deviceDto: com.telenordigital.nbiot.Device): Device {
            return Device(
                    id = deviceDto.id()!!,
                    collectionId = deviceDto.collectionID()!!,
                    imei = deviceDto.imei()!!,
                    imsi = deviceDto.imsi()!!,
                    tags = deviceDto.tags()!!
            )
        }
    }
}