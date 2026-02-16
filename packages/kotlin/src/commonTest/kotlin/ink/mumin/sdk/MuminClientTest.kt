package ink.mumin.sdk

import ink.mumin.sdk.models.Hadith
import io.ktor.client.engine.mock.*
import io.ktor.http.*
import io.ktor.utils.io.*
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class MuminClientTest {

    @Test
    fun testGetHadith() = runTest {
        val mockEngine = MockEngine { request ->
            respond(
                content = ByteReadChannel("""
                    {
                        "id": 1,
                        "collectionId": "sahih-bukhari",
                        "bookNumber": "1",
                        "chapterId": "1",
                        "hadithNumber": "1",
                        "arabicText": "Bismillah"
                    }
                """.trimIndent()),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }

        val client = MuminClient {
            apiKey = "test-key"
            engine = mockEngine
        }
        
        val hadith = client.hadiths.get(1)
        assertEquals(1, hadith.id)
        assertEquals("sahih-bukhari", hadith.collectionId)
        assertEquals("Bismillah", hadith.arabicText)
    }
}
