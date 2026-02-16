package ink.mumin.sdk.cache

import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlin.time.Duration

interface CacheAdapter {
    suspend fun <T : Any> get(key: String): T?
    suspend fun <T : Any> set(key: String, value: T, ttl: Duration)
    suspend fun delete(key: String)
    suspend fun clear()
}

class MemoryCache : CacheAdapter {
    private val mutex = Mutex()
    private val storage = mutableMapOf<String, CacheEntry<*>>()

    private data class CacheEntry<T>(
        val value: T,
        val expiry: Instant
    )

    override suspend fun <T : Any> get(key: String): T? = mutex.withLock {
        val entry = storage[key] ?: return null
        if (Clock.System.now() > entry.expiry) {
            storage.remove(key)
            return null
        }
        @Suppress("UNCHECKED_CAST")
        entry.value as? T
    }

    override suspend fun <T : Any> set(key: String, value: T, ttl: Duration) {
        mutex.withLock {
            storage[key] = CacheEntry(value, Clock.System.now() + ttl)
        }
    }

    override suspend fun delete(key: String) {
        mutex.withLock {
            storage.remove(key)
        }
    }

    override suspend fun clear() = mutex.withLock {
        storage.clear()
    }
}
