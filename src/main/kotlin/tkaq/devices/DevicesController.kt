package tkaq.devices

import io.javalin.Context
import io.javalin.NotFoundResponse

import tkaq.NBIoTClient
import tkaq.models.Device

object DevicesController {
    fun getDevicesForCollection(ctx: Context) {
        val devices = NBIoTClient.devices(ctx.pathParam("collection-id"))
                ?: throw NotFoundResponse()

        ctx.json(devices.map {
            Device.fromDto(it)
        })
    }

    fun getDeviceInCollection(ctx: Context) {
        val device = NBIoTClient.device(
                ctx.pathParam("collection-id"),
                ctx.pathParam("device-id")) ?: throw NotFoundResponse()

        ctx.json(Device.fromDto(device))

    }
}
