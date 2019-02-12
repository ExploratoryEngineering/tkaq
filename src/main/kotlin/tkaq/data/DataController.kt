package tkaq.data

import io.javalin.Context
import tkaq.DB
import java.time.Instant

object DataController {
    fun getData(ctx: Context) {
        val fromTimestamp = ctx.validatedQueryParam("since", "0").asLong().getOrThrow()
        val toTimeStamp = ctx.validatedQueryParam("until", Instant.now().toEpochMilli().toString()).asLong().getOrThrow()
        val limit = ctx.validatedQueryParam("limit", "255").asInt().getOrThrow()

        ctx.json(DB.retrieveDataPoints(
                fromTimestamp = fromTimestamp,
                toTimestamp = toTimeStamp,
                limit = limit
        ))
    }

    fun getDataForCollection(ctx: Context) {
        val collectionId = ctx.validatedPathParam("collection-id").getOrThrow()
        val fromTimestamp = ctx.validatedQueryParam("since", "0").asLong().getOrThrow()
        val toTimeStamp = ctx.validatedQueryParam("until", Instant.now().toEpochMilli().toString()).asLong().getOrThrow()
        val limit = ctx.validatedQueryParam("limit", "255").asInt().getOrThrow()

        ctx.json(DB.retrieveDataPointsForCollection(
                fromTimestamp = fromTimestamp,
                toTimestamp = toTimeStamp,
                limit = limit,
                collectionId = collectionId
        ))
    }

    fun getDataForCollectionDevice(ctx: Context) {
        val collectionId = ctx.validatedPathParam("collection-id").getOrThrow()
        val deviceId = ctx.validatedPathParam("device-id").getOrThrow()
        val fromTimestamp = ctx.validatedQueryParam("since", "0").asLong().getOrThrow()
        val toTimeStamp = ctx.validatedQueryParam("until", Instant.now().toEpochMilli().toString()).asLong().getOrThrow()
        val limit = ctx.validatedQueryParam("limit", "255").asInt().getOrThrow()

        ctx.json(DB.retrieveDataPointsForCollectionDevice(
                fromTimestamp = fromTimestamp,
                toTimestamp = toTimeStamp,
                limit = limit,
                collectionId = collectionId,
                deviceId = deviceId
        ))
    }
}
