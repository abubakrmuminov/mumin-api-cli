package ink.mumin.sdk.resources

import ink.mumin.sdk.cache.CacheAdapter
import ink.mumin.sdk.models.Collection
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlin.time.Duration

class CollectionsResource(
    private val client: HttpClient,
    private val cache: CacheAdapter?,
    private val defaultTtl: Duration
) {
    suspend fun list(): List<Collection> {
        val cacheKey = "collections:list"
        cache?.get<List<Collection>>(cacheKey)?.let { return it }

        val response: List<Collection> = client.get("collections").body()

        cache?.set(cacheKey, response, defaultTtl)
        return response
    }

    suspend fun get(slug: String): Collection {
        val cacheKey = "collection:$slug"
        cache?.get<Collection>(cacheKey)?.let { return it }

        val response: Collection = client.get("collections/$slug").body()

        cache?.set(cacheKey, response, defaultTtl)
        return response
    }
}
