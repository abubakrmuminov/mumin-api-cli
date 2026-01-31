import { MuminConfig, CacheAdapter } from './types'
import { HadithsResource } from './resources/hadiths'
import { CollectionsResource } from './resources/collections'
import { SearchResource } from './resources/search'
import { HTTPClient } from './utils/http'
import { MemoryCache } from './cache/memory'

export class MuminClient {
  private http: HTTPClient
  private cache: CacheAdapter

  // Resources
  public readonly hadiths: HadithsResource
  public readonly collections: CollectionsResource
  public readonly search: SearchResource

  constructor(apiKey: string, config?: Partial<MuminConfig>) {
    if (!apiKey) {
      throw new Error('API key is required. Get one at https://dashboard.mumin.ink')
    }

    const finalConfig: MuminConfig = {
      apiKey,
      baseURL: config?.baseURL || 'https://api.hadith.mumin.ink/v1',
      timeout: config?.timeout || 10000,
      retries: config?.retries || 2,
      retryDelay: config?.retryDelay || 1000,
      cache: config?.cache || new MemoryCache(),
      ...config,
    }

    this.http = new HTTPClient(finalConfig)
    this.cache = finalConfig.cache

    this.hadiths = new HadithsResource(this.http, this.cache)
    this.collections = new CollectionsResource(this.http, this.cache)
    this.search = new SearchResource(this.http, this.cache)
  }

  /**
   * Clear all internal caches
   */
  clearCache(): void {
      this.cache.clear()
  }
}

export default MuminClient
