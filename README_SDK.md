# 🕌 Mumin API SDK

The official, production-ready TypeScript SDK for the **Mumin Hadith API**.  
Build Islamic applications with confidence using our fully typed, cached, and robust client libraries.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green)

---

## ✨ Features

- **🛡️ Type Safety**: Full TypeScript support. No more guessing properties — getting `hadith.translation.text` is fully typed.
- **🧠 Intelligent Caching**: Built-in `MemoryCache` stores responses to reduce API calls and latency.
- **🔁 Auto-Retry**: Network glitches? The SDK automatically retries failed requests with exponential backoff.
- **📦 Monorepo Architecture**: Modular packages for **Core** (Node.js/JS), **React** hooks, and **Vue** composables.
- **⚡ Lightweight**: Zero-dependency core (uses native `fetch`).

---

## 📦 Installation

We provide separate packages depending on your framework:

### Core (Node.js / Vanilla JS / Next.js API)

```bash
npm install @mumin/core
```

### React

```bash
npm install @mumin/react @mumin/core
```

### Vue 3

```bash
npm install @mumin/vue @mumin/core
```

---

## 🚀 Quick Start

### 1. Vanilla JS / Node.js

Perfect for server-side code or simple scripts.

```typescript
import { MuminClient } from "@mumin/core";

const client = new MuminClient("YOUR_API_KEY");

async function main() {
  // Get a random hadith from Sahih al-Bukhari
  const random = await client.hadiths.random({ collection: "sahih-bukhari" });

  console.log("Hadith #", random.hadithNumber);
  console.log("Text:", random.translation?.text || random.arabicText);

  // Search for hadiths
  const results = await client.search.query("prayer", { limit: 5 });
  console.log("Found:", results.data.length);
}

main();
```

### 2. React

Use our dedicated hooks for easy data fetching.

**App.tsx**

```tsx
import { MuminProvider } from "@mumin/react";

function App() {
  return (
    <MuminProvider apiKey="YOUR_API_KEY">
      <HadithCard />
    </MuminProvider>
  );
}
```

**HadithCard.tsx**

```tsx
import { useHadith } from "@mumin/react";

export function HadithCard() {
  // Fetch Hadith #1 from Sahih Muslim
  const { data, loading, error } = useHadith(1, { lang: "en" });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="card">
      <h3>
        {data?.collection?.name} - #{data?.hadithNumber}
      </h3>
      <p>{data?.translation?.text}</p>
    </div>
  );
}
```

### 3. Vue 3

Reactive composables for your Vue apps.

**main.ts**

```typescript
import { createApp } from "vue";
import { MuminPlugin } from "@mumin/vue";
import App from "./App.vue";

const app = createApp(App);
app.use(MuminPlugin, { apiKey: "YOUR_API_KEY" });
app.mount("#app");
```

**HadithView.vue**

```vue
<script setup>
import { useHadith } from "@mumin/vue";

const { data, loading } = useHadith(1);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    {{ data?.translation?.text }}
  </div>
</template>
```

---

## 🛠️ Configuration

The `MuminClient` is highly configurable:

```typescript
const client = new MuminClient("API_KEY", {
  baseURL: "https://api.hadith.mumin.ink/v1", // Custom API URL
  timeout: 5000, // 5s timeout
  retries: 3, // Retry 3 times on fail
  retryDelay: 1000, // Wait 1s between retries
  cache: new RedisCache(), // Implement your own cache if needed!
});
```

---

## 📚 Resources API

### `client.hadiths`

- `.get(id)` - Get a single hadith by global ID.
- `.random(filters)` - Get a random hadith (filter by book, collection, grade).
- `.daily()` - Get the "Hadith of the Day".
- `.list(filters)` - Paginated list of hadiths.

### `client.collections`

- `.list()` - Get all available collections.
- `.get(slug)` - Get details about a collection (e.g., `sahih-bukhari`).

### `client.search`

- `.query(q, filters)` - Full-text search across translations and Arabic text.

---

## 🚨 Error Handling

The SDK throws typed error classes for better handling:

```typescript
import { AuthenticationError, RateLimitError } from "@mumin/core";

try {
  await client.hadiths.get(1);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Redirect to login or refresh token
  } else if (error instanceof RateLimitError) {
    // Wait a bit!
  }
}
```

---

## ⚖️ License

MIT © Mumin Team
