package tkaq.websocket

import io.javalin.json.JavalinJson
import io.javalin.websocket.WsSession
import org.eclipse.jetty.websocket.api.CloseStatus
import org.eclipse.jetty.websocket.api.StatusCode
import tkaq.models.TKAQDataPoint
import java.util.concurrent.ConcurrentHashMap

object WebSocketHandler {
    private val sessions: ConcurrentHashMap<String, HashSet<WsSession>> = ConcurrentHashMap()

    fun onWebSocketConnect(collectionId: String, wsSession: WsSession) {
        println("Connected a websocket to collection $collectionId")
        val sessionList = sessions.getOrDefault(collectionId, HashSet())

        sessionList.add(wsSession)
        sessions[collectionId] = sessionList
    }

    fun onWebsocketDisconnect(collectionId: String, wsSession: WsSession) {
        println("Disconnected a websocket from collection $collectionId")
        val sessionList = sessions.getOrDefault(collectionId, HashSet())

        sessionList.remove(wsSession)
        sessions[collectionId] = sessionList
    }

    fun broadcastTKAQDataPoint(dataPoint: TKAQDataPoint) {
        val sessionList = sessions.getOrDefault(dataPoint.collectionId, HashSet())
        sessionList.forEach { it.send(JavalinJson.toJson(dataPoint)) }
    }

    fun closeAndClearAllWebSockets() {
        sessions.forEach {
            it.value.forEach {session ->
                session.close(CloseStatus(StatusCode.SERVICE_RESTART, "Server restarting"))
                it.value.remove(session)
            }
        }
    }
}