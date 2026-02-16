package ink.mumin.sdk.resources

import ink.mumin.sdk.cache.CacheAdapter
import ink.mumin.sdk.models.Hadith
import ink.mumin.sdk.models.PaginatedResponse
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlin.time.Duration

class SearchResource(
    private val client: HttpClient,
    private val cache: CacheAdapter?,
    private val defaultTtl: Duration
) {
    suspend fun query(text: String, filters: Map<String, String>? = null): PaginatedResponse<Hadith> {
        val cacheKey = "search:$text:${filters?.hashCode() ?: 0}"
        cache?.get<PaginatedResponse<Hadith>>(cacheKey)?.let { return it }

        val response: PaginatedResponse<Hadith> = client.get("hadiths/search") {
            parameter("q", text)
            filters?.forEach { (key, value) ->
                parameter(key, value)
            }
        }.body()

        cache?.set(cacheKey, response, defaultTtl)
        return response
    }
}
