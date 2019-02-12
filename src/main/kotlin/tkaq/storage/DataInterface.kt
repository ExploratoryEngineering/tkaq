package tkaq.storage

import tkaq.models.TKAQDataPoint
import java.time.Instant

interface DataInterface {
    fun addDataPoint(dataPoint: TKAQDataPoint)
    fun addDataPoints(dataPoints: List<TKAQDataPoint>)
    fun retrieveDataPoints(fromTimestamp: Long = 0, toTimestamp: Long = Instant.now().toEpochMilli(), limit: Int = 255): List<TKAQDataPoint>
    fun retrieveDataPointsForCollection(collectionId: String, fromTimestamp: Long = 0, toTimestamp: Long = Instant.now().toEpochMilli(), limit: Int = 255): List<TKAQDataPoint>
    fun retrieveDataPointsForCollectionDevice(collectionId: String, deviceId: String, fromTimestamp: Long, toTimestamp: Long, limit: Int): List<TKAQDataPoint>
}