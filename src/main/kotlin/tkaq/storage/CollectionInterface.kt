package tkaq.storage

import tkaq.models.Collection

interface CollectionInterface {
    fun addCollection(id: String, teamId: String, tags: Map<String, String>)
    fun retrieveCollections(): List<Collection>
    fun retrieveCollectionById(id: String): Collection?
    fun deleteCollectionById(id: String)
}