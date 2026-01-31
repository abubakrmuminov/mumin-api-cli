import { HTTPClient } from '../utils/http'
import { CacheAdapter, Hadith, PaginatedResponse, HadithQuery } from '../types'

export class SearchResource {
  constructor(
    private http: HTTPClient,
    private cache: CacheAdapter
  ) {}

  async query(q: string, options?: HadithQuery): Promise<PaginatedResponse<Hadith>> {
    const cacheKey = `search:${q}:${JSON.stringify(options)}`
    const cached = await this.cache.get<PaginatedResponse<Hadith>>(cacheKey)
    if (cached) return cached

    const response = await this.http.get<PaginatedResponse<Hadith>>('/hadiths/search', {
      params: { q, ...options } as Record<string, string | number | boolean | undefined>
    })
    
    await this.cache.set(cacheKey, response, 300) // 5 minutes
    return response
  }
}
