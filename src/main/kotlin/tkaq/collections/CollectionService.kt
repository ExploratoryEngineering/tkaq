package tkaq.collections

import com.telenordigital.nbiot.ImmutableDataSearchParameters
import com.telenordigital.nbiot.OutputDataMessage
import org.eclipse.jetty.websocket.api.CloseStatus
import org.eclipse.jetty.websocket.client.WebSocketClient
import java.time.Instant
import java.util.*

import tkaq.DB
import tkaq.NBIoTClient
import tkaq.TKAQ_LOG
import tkaq.models.TKAQDataPoint
import tkaq.transformer.DeviceData
import tkaq.websocket.WebSocketHandler


object CollectionService {
    fun fetchAllDataForCollection(collectionId: String): ArrayList<TKAQDataPoint> {
        val tkaqCollection = DB.retrieveCollectionById(collectionId)
        val dataPoints: ArrayList<TKAQDataPoint> = ArrayList()

        val fetchLimit = 10000
        var sinceLimit = Date(0).toInstant()
        var untilLimit = Instant.now()
        var hasMore = true

        if (tkaqCollection != null) {
            TKAQ_LOG.debug("Collection exists, filling in missing data.")
            val tkaqDataPoint = DB.retrieveDataPointsForCollection(
                    collectionId = collectionId,
                    limit = 1
            )

            if (!tkaqDataPoint.isEmpty()) {
                // Add one millis to avoid duplicating data point
                sinceLimit = tkaqDataPoint.first().timestamp.plusMillis(1L)
            }

            TKAQ_LOG.debug("The timestamp for last data is ${sinceLimit.toEpochMilli()}")
        } else {
            TKAQ_LOG.debug("Couldn't find collection $collectionId. Registering new collection and pulling down all data.")
            val collection = NBIoTClient.collection(collectionId)

            if (collection.id() != null) {
                DB.addCollection(
                        collection.id()!!,
                        collection.teamID()!!,
                        collection.tags()!!
                )
            } else {
                TKAQ_LOG.warn("Collection '$collectionId' could not be found in Horde. Please double check that you have access.")
            }
        }

        while (hasMore) {
            val clientDataPoints = NBIoTClient.data(collectionId, ImmutableDataSearchParameters.Builder()
                    .limit(fetchLimit)
                    .since(sinceLimit)
                    .until(untilLimit)
                    .build()
            )

            dataPoints.addAll(clientDataPoints.fold(ArrayList()) { acc, dataPoint: OutputDataMessage ->
                try {
                    acc.add(DeviceData.toTKAQDataPoint(dataPoint))
                } catch (_: IllegalArgumentException) {
                    TKAQ_LOG.warn("Could not parse to TKAQ datapoint")
                }
                acc
            })


            if (clientDataPoints.size != fetchLimit || dataPoints.isEmpty()) {
                hasMore = false
            } else {
                untilLimit = dataPoints.last().timestamp
            }
        }

        TKAQ_LOG.debug("Adding ${dataPoints.size} data points")
        DB.addDataPoints(dataPoints)

        return dataPoints
    }

    fun streamDataFromCollection(collectionId: String): WebSocketClient {
        return NBIoTClient.collectionOutput(collectionId) { handler ->
            handler.onConnect { session -> TKAQ_LOG.debug("Connected WebSocket session for $collectionId @${session.localAddress}") }
            handler.onClose { code, reason -> TKAQ_LOG.debug("Closed with code $code due to $reason") }
            handler.onMessage {
                try {
                    val tkaqDataPoint = DeviceData.toTKAQDataPoint(it)

                    DB.addDataPoint(tkaqDataPoint)
                    WebSocketHandler.broadcastTKAQDataPoint(tkaqDataPoint)

                    TKAQ_LOG.debug("Added data point from device ${it.device().id()}")
                } catch (ex: IllegalArgumentException) {
                    TKAQ_LOG.warn("Could not map stream data to TKAQ data point", ex)
                }
            }
            handler.onError { session, throwable ->
                TKAQ_LOG.error("Received error from websocket.", throwable)
                if (session.isOpen) {
                    session.close(CloseStatus(1006, "Got error from WebSocket"))
                    session.disconnect()
                }
                reconnectCollectionStream(collectionId)
            }
        }
    }

    private fun reconnectCollectionStream(collectionId: String) {
        // TODO: Add backoff in case things are really broken.
        CollectionService.fetchAllDataForCollection(collectionId)
        TKAQ_LOG.debug("Reconnecting WebSocket for collection $collectionId")
        streamDataFromCollection(collectionId)
    }
}