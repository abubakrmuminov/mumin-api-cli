import { HTTPClient } from '../utils/http'
import { CacheAdapter, Collection } from '../types'

export class CollectionsResource {
  constructor(
    private http: HTTPClient,
    private cache: CacheAdapter
  ) {}

  async list(): Promise<Collection[]> {
    const cacheKey = 'collections:all'
    const cached = await this.cache.get<Collection[]>(cacheKey)
    if (cached) return cached

    const response = await this.http.get<Collection[]>('/collections')
    await this.cache.set(cacheKey, response, 86400) // 24 hours
    return response
  }

  async get(slug: string): Promise<Collection> {
    const cacheKey = `collection:${slug}`
    const cached = await this.cache.get<Collection>(cacheKey)
    if (cached) return cached

    const response = await this.http.get<Collection>(`/collections/${slug}`)
    await this.cache.set(cacheKey, response, 86400)
    return response
  }
}
