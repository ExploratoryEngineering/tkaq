package tkaq.data

import io.javalin.Context
import tkaq.DB
import java.time.Instant

data class DataQuery(
        val fromTimestamp: Long,
        val toTimestamp: Long,
        val limit: Int
)

fun Context.dataQuery() = DataQuery(
        fromTimestamp = this.queryParam<Long>("since", "0").get(),
        toTimestamp = this.queryParam<Long>("until", Instant.now().toEpochMilli().toString()).get(),
        limit = this.queryParam<Int>("limit", "255").get()
)


object DataController {
    fun getData(ctx: Context) {
        val dataQuery = ctx.dataQuery()

        ctx.json(DB.retrieveDataPoints(
                fromTimestamp = dataQuery.fromTimestamp,
                toTimestamp = dataQuery.toTimestamp,
                limit = dataQuery.limit
        ))
    }

    fun getDataForCollection(ctx: Context) {
        val dataQuery = ctx.dataQuery()
        val collectionId = ctx.pathParam("collection-id")

        ctx.json(DB.retrieveDataPointsForCollection(
                fromTimestamp = dataQuery.fromTimestamp,
                toTimestamp = dataQuery.toTimestamp,
                limit = dataQuery.limit,
                collectionId = collectionId
        ))
    }

    fun getDataForCollectionDevice(ctx: Context) {
        val dataQuery = ctx.dataQuery()
        val collectionId = ctx.pathParam("collection-id")
        val deviceId = ctx.pathParam("device-id")

        ctx.json(DB.retrieveDataPointsForCollectionDevice(
                fromTimestamp = dataQuery.fromTimestamp,
                toTimestamp = dataQuery.toTimestamp,
                limit = dataQuery.limit,
                collectionId = collectionId,
                deviceId = deviceId
        ))
    }
}
