package tkaq.collections

import io.javalin.Context
import io.javalin.NotFoundResponse

import tkaq.DB

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
