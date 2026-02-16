package ink.mumin.sdk.resources

import ink.mumin.sdk.cache.CacheAdapter
import ink.mumin.sdk.models.Hadith
import ink.mumin.sdk.models.PaginatedResponse
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlin.time.Duration

class HadithsResource(
    private val client: HttpClient,
    private val cache: CacheAdapter?,
    private val defaultTtl: Duration
) {
    suspend fun get(id: Int, lang: String? = null): Hadith {
        val cacheKey = "hadith:$id:${lang ?: "default"}"
        cache?.get<Hadith>(cacheKey)?.let { return it }

        val response: Hadith = client.get("hadiths/$id") {
            lang?.let { parameter("lang", it) }
        }.body()

        cache?.set(cacheKey, response, defaultTtl)
        return response
    }

    suspend fun random(collection: String? = null): Hadith {
        return client.get("hadiths/random") {
            collection?.let { parameter("collection", it) }
        }.body()
    }

    suspend fun daily(lang: String? = null): Hadith {
        val cacheKey = "daily:${lang ?: "default"}"
        cache?.get<Hadith>(cacheKey)?.let { return it }

        val response: Hadith = client.get("hadiths/daily") {
            lang?.let { parameter("lang", it) }
        }.body()

        cache?.set(cacheKey, response, defaultTtl)
        return response
    }

    suspend fun list(page: Int = 1, limit: Int = 20, collection: String? = null): PaginatedResponse<Hadith> {
        return client.get("hadiths") {
            parameter("page", page)
            parameter("limit", limit)
            collection?.let { parameter("collection", it) }
        }.body()
    }

    suspend fun search(query: String, page: Int = 1, limit: Int = 20): PaginatedResponse<Hadith> {
        return client.get("hadiths/search") {
            parameter("q", query)
            parameter("page", page)
            parameter("limit", limit)
        }.body()
    }
}
