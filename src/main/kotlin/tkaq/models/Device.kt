package tkaq.models

data class Device(val id: String, val collectionId: String, val imei: String, val imsi: String, val tags: Map<String, String>)