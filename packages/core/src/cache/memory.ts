import { CacheAdapter } from '../types'

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class MemoryCache implements CacheAdapter {
  private store = new Map<string, CacheEntry<any>>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(cleanupIntervalMs: number = 60000) {
    // Start cleanup logic to avoid memory leaks
    if (typeof setInterval !== 'undefined') {
        this.cleanupInterval = setInterval(() => {
          this.cleanup()
        }, cleanupIntervalMs)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value as T
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async clear(): Promise<void> {
    this.store.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
      }
    }
  }

  // Helper to stop interval if needed (e.g. tests)
  dispose() {
    if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval)
    }
  }
}
