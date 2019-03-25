package tkaq.devices

import io.javalin.Context
import io.javalin.NotFoundResponse

import tkaq.NBIoTClient
import tkaq.models.Device

object DevicesController {
    fun getDevicesForCollection(ctx: Context) {
        val devices = NBIoTClient.devices(ctx.pathParam("collection-id"))
                ?: throw NotFoundResponse()
        ctx.status(200)


        ctx.json(devices.map {
            Device(
                    id = it.id()!!,
                    collectionId = it.collectionID()!!,
                    imei = it.imei()!!,
                    imsi = it.imsi()!!,
                    tags = it.tags()!!
            )
        })
    }

    fun getDeviceInCollection(ctx: Context) {
        val device = NBIoTClient.device(
                ctx.pathParam("collection-id"),
                ctx.pathParam("device-id")) ?: throw NotFoundResponse()

        ctx.json(Device(
                id = device.id()!!,
                collectionId = device.collectionID()!!,
                imei = device.imei()!!,
                imsi = device.imsi()!!,
                tags = device.tags()!!
        ))

    }
}
