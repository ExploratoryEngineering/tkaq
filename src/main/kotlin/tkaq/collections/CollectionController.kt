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
        val collection = DB.retrieveCollectionById(ctx.pathParam("collection-id"))
                ?: throw NotFoundResponse()
        ctx.json(collection)
    }

    fun getCollections(ctx: Context) {
        val collections = DB.retrieveCollections()
        ctx.json(collections)
    }
}
