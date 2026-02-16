package ink.mumin.sdk

import ink.mumin.sdk.cache.CacheAdapter
import ink.mumin.sdk.cache.MemoryCache
import ink.mumin.sdk.resources.CollectionsResource
import ink.mumin.sdk.resources.HadithsResource
import ink.mumin.sdk.resources.SearchResource
import io.ktor.client.*
import io.ktor.client.engine.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import kotlin.time.Duration
import kotlin.time.Duration.Companion.seconds

/**
 * The main entry point for the Mumin Hadith API.
 * 
 * Use the [Companion.invoke] operator with a DSL block to configure and create an instance.
 */
class MuminClient internal constructor(
    private val config: MuminConfig
) {
    private val httpClient = if (config.engine != null) HttpClient(config.engine) else HttpClient()
    
    init {
        httpClient.config {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    coerceInputValues = true
                })
            }
            install(HttpTimeout) {
                requestTimeoutMillis = config.timeout.inWholeMilliseconds
                connectTimeoutMillis = config.timeout.inWholeMilliseconds
                socketTimeoutMillis = config.timeout.inWholeMilliseconds
            }
            defaultRequest {
                url(config.baseUrl)
                header("X-API-Key", config.apiKey)
            }
        }
    }

    private val cache: CacheAdapter? = if (config.cacheConfig.enabled) config.cacheConfig.adapter else null

    /**
     * Resource for hadith-related operations.
     */
    val hadiths = HadithsResource(httpClient, cache, config.cacheConfig.ttl)
    
    /**
     * Resource for collection-related operations.
     */
    val collections = CollectionsResource(httpClient, cache, config.cacheConfig.ttl)
    
    /**
     * Resource for search operations.
     */
    val search = SearchResource(httpClient, cache, config.cacheConfig.ttl)

    companion object {
        /**
         * Creates a new [MuminClient] using the provided [block] for configuration.
         */
        operator fun invoke(block: MuminConfigBuilder.() -> Unit): MuminClient {
            val builder = MuminConfigBuilder().apply(block)
            return MuminClient(builder.build())
        }
    }
}

internal data class MuminConfig(
    val apiKey: String,
    val baseUrl: String,
    val timeout: Duration,
    val cacheConfig: CacheConfig,
    val engine: HttpClientEngine? = null
)

internal data class CacheConfig(
    val enabled: Boolean,
    val ttl: Duration,
    val adapter: CacheAdapter
)

/**
 * Builder for [MuminClient] configuration.
 */
class MuminConfigBuilder {
    /**
     * The API key for authentication. Get one at https://dashboard.mumin.ink
     */
    var apiKey: String = ""
    
    /**
     * The base URL of the Mumin API. Defaults to the official production API.
     */
    var baseUrl: String = "https://api.hadith.mumin.ink/v1"
    
    /**
     * Global timeout for all requests.
     */
    var timeout: Duration = 30.seconds
    
    /**
     * Custom Ktor engine for testing or specific platform needs.
     */
    var engine: HttpClientEngine? = null
    
    private var cacheConfigBuilder = CacheConfigBuilder()

    /**
     * Configure caching behavior.
     */
    fun cache(block: CacheConfigBuilder.() -> Unit) {
        cacheConfigBuilder.apply(block)
    }

    internal fun build(): MuminConfig {
        if (apiKey.isEmpty()) {
            throw IllegalArgumentException("API key is required")
        }
        return MuminConfig(apiKey, baseUrl, timeout, cacheConfigBuilder.build(), engine)
    }
}

class CacheConfigBuilder {
    var enabled: Boolean = true
    var ttl: Duration = 3600.seconds
    var adapter: CacheAdapter = MemoryCache()

    internal fun build(): CacheConfig {
        return CacheConfig(enabled, ttl, adapter)
    }
}
