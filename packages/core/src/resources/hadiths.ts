import { HTTPClient } from '../utils/http'
import { CacheAdapter, Hadith, HadithQuery, PaginatedResponse } from '../types'

export class HadithsResource {
  constructor(
    private http: HTTPClient,
    private cache: CacheAdapter
  ) {}

  /**
   * Get a single hadith by ID
   */
  async get(id: number, options?: { lang?: string }): Promise<Hadith> {
    const cacheKey = `hadith:${id}:${options?.lang || 'default'}`
    const cached = await this.cache.get<Hadith>(cacheKey)
    if (cached) return cached

    const response = await this.http.get<Hadith>(`/hadiths/${id}`, {
      params: options as Record<string, string>
    })

    await this.cache.set(cacheKey, response, 3600) // 1 hour
    return response
  }

  /**
   * Get a random hadith
   */
  async random(options?: HadithQuery): Promise<Hadith> {
    return this.http.get<Hadith>('/hadiths/random', {
      params: options as Record<string, string | number | boolean | undefined>
    })
  }

  /**
   * Get the daily hadith
   */
  async daily(options?: { lang?: string }): Promise<Hadith> {
     const cacheKey = `daily:${options?.lang || 'default'}`
     const cached = await this.cache.get<Hadith>(cacheKey)
     if (cached) return cached

    const response = await this.http.get<Hadith>('/hadiths/daily', {
      params: options as Record<string, string>
    })
    
    // Cache until next day roughly, or just 1 hour
    await this.cache.set(cacheKey, response, 3600) 
    return response
  }

  /**
   * List/Search hadiths
   */
  async list(options?: HadithQuery): Promise<PaginatedResponse<Hadith>> {
    // If it's a search query, route to /search logic or handle here if supported
    // The spec says 'list' hits /hadiths
    return this.http.get<PaginatedResponse<Hadith>>('/hadiths', {
      params: options as Record<string, string | number | boolean | undefined>
    })
  }

  /**
   * Search hadiths (Facade for search endpoint if separate)
   */
  async search(query: string, options?: HadithQuery): Promise<PaginatedResponse<Hadith>> {
     return this.http.get<PaginatedResponse<Hadith>>('/hadiths/search', {
        params: { q: query, ...options } as Record<string, string | number | boolean | undefined>
     })
  }
}
