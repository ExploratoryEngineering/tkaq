package tkaq

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.telenordigital.nbiot.*
import io.javalin.Javalin
import io.javalin.JavalinEvent
import io.javalin.apibuilder.ApiBuilder.*
import io.javalin.json.JavalinJackson
import org.eclipse.jetty.websocket.client.WebSocketClient
import sun.misc.Signal

import tkaq.collections.CollectionController
import tkaq.collections.CollectionService
import tkaq.data.DataController
import tkaq.devices.DevicesController
import tkaq.storage.SQLDB
import tkaq.websocket.WebSocketHandler
import kotlin.system.exitProcess

val NBIoTClient = Client(Config.endpoint, Config.hordeApiKey)
val DB = SQLDB
val HordeWebsocket: WebSocketClient = CollectionService.streamDataFromCollection(Config.collectionId)

fun main(args: Array<String>) {
    JavalinJackson.configure(ObjectMapper().apply {
        registerModule(JavaTimeModule())
        configure(SerializationFeature.WRITE_DATE_TIMESTAMPS_AS_NANOSECONDS, false)
    })

    CollectionService.fetchAllDataForCollection(Config.collectionId)

    val collections = DB.retrieveCollections()

    println("All collections available (${collections.size}):")
    println(collections.map { it.tags["name"] })

    val app = Javalin.create().apply {
        port(Integer.parseInt(Config.port))
        enableStaticFiles("/public")
        enableSinglePageMode("/", "/public/index.html")
        enableCorsForAllOrigins()
        defaultContentType("application/json")
    }

    app.routes {
        get("hc") {
            it.status(200).result("pong")
        }
        path("api/v1") {
            path("collections") {
                get(CollectionController::getCollections)
                path("/:collection-id") {
                    get(CollectionController::getCollection)
                    path("/stream") {
                        ws (WebSocketHandler::handle)
                    }

                    path("data") {
                        get(DataController::getDataForCollection)
                    }

                    path("/devices") {
                        get(DevicesController::getDevicesForCollection)
                        path("/:device-id") {
                            get(DevicesController::getDeviceInCollection)
                            path("/data") {
                                get(DataController::getDataForCollectionDevice)
                            }
                        }
                    }
                }
            }
        }
    }

    app.event(JavalinEvent.SERVER_STOPPING) {
        println("Closing horde websocket")
        HordeWebsocket.stop()
        println("Closing all connected websockets")
        WebSocketHandler.closeAndClearAllWebSockets()
    }

    app.event(JavalinEvent.SERVER_STOPPED) {
        exitProcess(0)
    }

    app.start()

    Signal.handle(Signal("INT")) {
        app.stop()
    }
}