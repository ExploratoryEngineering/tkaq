package tkaq.transformer

import com.telenordigital.nbiot.OutputDataMessage
import tkaq.models.TKAQDataPoint
import java.lang.IllegalArgumentException
import java.nio.ByteBuffer

object DeviceData {
    fun toTKAQDataPoint(dataPoint: OutputDataMessage): TKAQDataPoint {
        val payload = dataPoint.payload()

        if (payload.size < 37) {
            throw IllegalArgumentException("The payload is not compatible with the TKAQ data model")
        }

        return TKAQDataPoint(
                collectionId = dataPoint.device().collectionID()!!,
                deviceId = dataPoint.device().id()!!,
                timestamp = dataPoint.received()!!,
                payload = payload,
                time = getTime(payload),
                longitude = getLongitude(payload),
                latitude = getLatitude(payload),
                altitude = getAltitude(payload),
                relHumidity = getRelativeHumidity(payload),
                temperature = getTemperature(payload),
                co2Equivalents = getCO2Equivalents(payload),
                vocEquivalents = getVOCEquivalents(payload),
                pm10 = getPM10(payload),
                pm25 = getPM25(payload)
        )
    }

    private fun getTime(payload: ByteArray) = ByteBuffer.wrap(payload).getFloat(0)

    private fun getLongitude(payload: ByteArray) = (ByteBuffer.wrap(payload).getFloat(4) * (180 / Math.PI)).toFloat()

    private fun getLatitude(payload: ByteArray) = (ByteBuffer.wrap(payload).getFloat(8) * (180 / Math.PI)).toFloat()

    private fun getAltitude(payload: ByteArray) = ByteBuffer.wrap(payload).getFloat(12)

    private fun getRelativeHumidity(payload: ByteArray) = ByteBuffer.wrap(payload).getFloat(16)

    private fun getTemperature(payload: ByteArray) = ByteBuffer.wrap(payload).getFloat(20)

    private fun getCO2Equivalents(payload: ByteArray) = ByteBuffer.wrap(payload).getShort(25).toInt()

    private fun getVOCEquivalents(payload: ByteArray) = ByteBuffer.wrap(payload).getShort(27).toInt()

    private fun getPM25(payload: ByteArray) = ByteBuffer.wrap(payload).getShort(33).toInt()

    private fun getPM10(payload: ByteArray) = ByteBuffer.wrap(payload).getShort(35).toInt()
}