package tkaq.collections

import io.javalin.Context
import io.javalin.InternalServerErrorResponse
import io.javalin.NotFoundResponse
import io.javalin.core.util.Header

import tkaq.DB
import tkaq.NBIoTClient
import tkaq.currentUser

object CollectionController {
    fun getCollection(ctx: Context) {
        val collection = DB.retrieveCollectionById(ctx.validatedPathParam("collection-id").getOrThrow())
                ?: throw NotFoundResponse()
        ctx.status(200)
        ctx.json(collection)
    }

    fun getCollections(ctx: Context) {
        val collections = DB.retrieveCollections()
        ctx.status(200)
        ctx.json(collections)
    }
}
