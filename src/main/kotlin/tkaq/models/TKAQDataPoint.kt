package tkaq.models

import java.time.Instant

data class TKAQDataPoint(
        val collectionId: String,
        val deviceId: String,
        val timestamp: Instant,
        val payload: ByteArray,
        val time: Float,
        val co2Equivalents: Int,
        val vocEquivalents: Int,
        val temperature: Float,
        val pm25: Int,
        val pm10: Int,
        val relHumidity: Float,
        val longitude: Float,
        val latitude: Float,
        val altitude: Float
)