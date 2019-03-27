package tkaq.models

import com.telenordigital.nbiot.OutputDataMessage
import java.lang.IllegalArgumentException
import java.nio.ByteBuffer
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
) {
    companion object {
        fun fromOutputMessage(outputMessage: OutputDataMessage): TKAQDataPoint {
            val payload = outputMessage.payload()

            if (payload.size < 37) {
                throw IllegalArgumentException("The payload is not compatible with the TKAQ data model")
            }

            val device = Device.fromDto(outputMessage.device())
            val byteBuffer = ByteBuffer.wrap(outputMessage.payload())
            return TKAQDataPoint(
                    collectionId = device.collectionId,
                    deviceId = device.id,
                    timestamp = outputMessage.received(),
                    payload = payload,
                    time = getTime(byteBuffer),
                    longitude = getLongitude(byteBuffer),
                    latitude = getLatitude(byteBuffer),
                    altitude = getAltitude(byteBuffer),
                    relHumidity = getRelativeHumidity(byteBuffer),
                    temperature = getTemperature(byteBuffer),
                    co2Equivalents = getCO2Equivalents(byteBuffer),
                    vocEquivalents = getVOCEquivalents(byteBuffer),
                    pm10 = getPM10(byteBuffer),
                    pm25 = getPM25(byteBuffer))
        }
    }
}

private fun getTime(byteBuffer: ByteBuffer) = byteBuffer.getFloat(0)
private fun getLongitude(byteBuffer: ByteBuffer) = (byteBuffer.getFloat(4) * (180 / Math.PI)).toFloat()
private fun getLatitude(byteBuffer: ByteBuffer) = (byteBuffer.getFloat(8) * (180 / Math.PI)).toFloat()
private fun getAltitude(byteBuffer: ByteBuffer) = byteBuffer.getFloat(12)
private fun getRelativeHumidity(byteBuffer: ByteBuffer) = byteBuffer.getFloat(16)
private fun getTemperature(byteBuffer: ByteBuffer) = byteBuffer.getFloat(20)
private fun getCO2Equivalents(byteBuffer: ByteBuffer) = byteBuffer.getShort(25).toInt()
private fun getVOCEquivalents(byteBuffer: ByteBuffer) = byteBuffer.getShort(27).toInt()
private fun getPM25(byteBuffer: ByteBuffer) = byteBuffer.getShort(33).toInt()
private fun getPM10(byteBuffer: ByteBuffer) = byteBuffer.getShort(35).toInt()
