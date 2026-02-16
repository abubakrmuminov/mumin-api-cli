package ink.mumin.sdk

import ink.mumin.sdk.cache.MemoryCache
import kotlinx.coroutines.delay
import kotlinx.coroutines.test.runTest
import kotlin.test.*
import kotlin.time.Duration.Companion.milliseconds

class CacheTest {
    @Test
    fun testCacheSetAndGet() = runTest {
        val cache = MemoryCache()
        cache.set("foo", "bar", 1000.milliseconds)
        assertEquals("bar", cache.get<String>("foo"))
    }

    @Test
    fun testCacheExpiration() = runTest {
        val cache = MemoryCache()
        cache.set("foo", "bar", 10.milliseconds)
        delay(50.milliseconds)
        assertNull(cache.get<String>("foo"))
    }

    @Test
    fun testCacheClear() = runTest {
        val cache = MemoryCache()
        cache.set("foo", "bar", 1000.milliseconds)
        cache.clear()
        assertNull(cache.get<String>("foo"))
    }

    @Test
    fun testCacheDelete() = runTest {
        val cache = MemoryCache()
        cache.set("foo", "bar", 1000.milliseconds)
        cache.delete("foo")
        assertNull(cache.get<String>("foo"))
    }
}
