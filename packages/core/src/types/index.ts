
// ============================================
// CONFIGURATION
// ============================================

export interface MuminConfig {
  apiKey: string
  baseURL: string
  timeout: number
  retries: number
  retryDelay: number
  cache: CacheAdapter
}

// ============================================
// CACHE
// ============================================

export interface CacheAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
}

// ============================================
// HADITH
// ============================================

export interface Hadith {
  id: number
  collectionId: string
  bookNumber: string | number
  chapterId: string | number
  hadithNumber: string
  hadithNumberInt?: number
  label?: string
  
  // Content variants
  arabicText?: string
  english?: string
  russian?: string

  // Translation object found in API response
  translation?: {
    id: number
    text: string
    languageCode: string
    narrator?: string
  }
  
  // Computed/Standardized fields (Removed flat 'text' as it is not in API)
  // text: string // Removing this to avoid confusion as it's not in raw response
}

export interface HadithQuery {
  lang?: string
  collection?: string
  book?: number
  grade?: string
  page?: number
  limit?: number
  q?: string // for search
}

// ============================================
// COLLECTION
// ============================================

export interface Collection {
  slug: string // 'sahih-bukhari'
  name: string
  totalHadiths: number
  description?: string
}

export interface Book {
  id: number | string
  collectionSlug: string
  bookNumber: string
  title: string
  hadithCount?: number
}

export interface Chapter {
  id: number | string
  bookId: number | string
  chapterNumber: string
  title: string
}

// ============================================
// RESPONSE WRAPPERS
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ============================================
// ERROR CLASSES
// ============================================

export { MuminAPIError, AuthenticationError, RateLimitError } from '../utils/errors'
