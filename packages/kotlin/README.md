# 🕌 Mumin Kotlin SDK

The official Kotlin Multiplatform (KMP) SDK for the **Mumin Hadith API**.  
Build Android, iOS, and JVM applications with a modern, type-safe, and DSL-powered client.

## ✨ Features

- **🌍 Multiplatform**: Supports Android, iOS, and JVM.
- **🚀 Ktor Powered**: Uses the flexible Ktor HTTP client with Darwin engine for iOS.
- **🛡️ DSL Configuration**: Fluent and expressive API for client setup.
- **🧠 Thread-Safe Cache**: Built-in memory cache with `Mutex` and TTL support.
- **🔗 Coroutines Support**: All API methods are `suspend`.
- **📦 Type Safety**: Fully typed models with `kotlinx-serialization`.

## 📦 Installation

Add the following to your `build.gradle.kts`:

```kotlin
repositories {
    mavenCentral()
    // or JitPack if applicable
}

dependencies {
    implementation("ink.mumin:sdk:1.0.0")

    // Required Ktor engine for your platform:
    // Android: io.ktor:ktor-client-okhttp:2.3.7
    // JVM: io.ktor:ktor-client-cio:2.3.7
    // iOS: io.ktor:ktor-client-darwin:2.3.7
}
```

### Swift (iOS) Setup

Once the SDK is compiled as a Framework/XCFramework, you can use it directly in Swift:

```swift
import MuminSDK

let client = MuminClient { config in
    config.apiKey = "YOUR_API_KEY"
}

func fetchRandomHadith() async {
    do {
        let hadith = try await client.hadiths.random(collection: nil)
        print("Hadith: \(hadith.translation?.text ?? "")")
    } catch {
        print("Error: \(error)")
    }
}
```

## 🚀 Quick Start

```kotlin
import ink.mumin.sdk.MuminClient
import kotlin.time.Duration.Companion.minutes

val client = MuminClient {
    apiKey = "YOUR_API_KEY"
    cache {
        enabled = true
        ttl = 30.minutes
    }
}

suspend fun main() {
    // Get a random hadith
    val hadith = client.hadiths.random()
    println("Hadith: ${hadith.translation?.text}")

    // Get the daily hadith in Russian
    val daily = client.hadiths.daily(lang = "ru")
    println("Daily: ${daily.russian}")
}
```

## 🛠️ Configuration DSL

```kotlin
val client = MuminClient {
    apiKey = "..."
    baseUrl = "https://api.hadith.mumin.ink/v1"
    timeout = 30.seconds

    cache {
        enabled = true
        ttl = 1.hours
        // adapter = MyCustomCache() // Implement CacheAdapter
    }
}
```

## 📚 API Resources

### `client.hadiths`

- `get(id: Int, lang: String?)`
- `random(collection: String?)`
- `daily(lang: String?)`
- `list(page: Int, limit: Int, collection: String?)`
- `search(query: String, page: Int, limit: Int)`

### `client.collections`

- `list()`
- `get(slug: String)`

### `client.search`

- `query(text: String, filters: Map<String, String>?)`

## ⚖️ License

MIT © Mumin Team
