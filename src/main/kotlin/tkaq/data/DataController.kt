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
        fromTimestamp = this.validatedQueryParam("since", "0").asLong().getOrThrow(),
        toTimestamp = this.validatedQueryParam("until", Instant.now().toEpochMilli().toString()).asLong().getOrThrow(),
        limit = this.validatedQueryParam("limit", "255").asInt().getOrThrow()
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
