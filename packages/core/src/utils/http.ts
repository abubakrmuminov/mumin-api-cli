import { MuminConfig } from '../types'
import { MuminAPIError, RateLimitError, AuthenticationError, NotFoundError } from './errors'

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>
  body?: any
  headers?: HeadersInit
}

export class HTTPClient {
  private baseURL: string
  private apiKey: string
  private timeout: number
  private retries: number
  private retryDelay: number

  constructor(config: MuminConfig) {
    this.baseURL = config.baseURL
    this.apiKey = config.apiKey
    this.timeout = config.timeout
    this.retries = config.retries
    this.retryDelay = config.retryDelay
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, options)
  }

  async post<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, { ...options, body })
  }

  private async request<T>(
    method: string,
    path: string,
    options?: RequestOptions
  ): Promise<T> {
    // Ensure no double slashes if path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const url = `${this.baseURL}${cleanPath}`
    
    // Filter out undefined params
    const cleanParams: Record<string, string> = {}
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          cleanParams[key] = String(value)
        }
      })
    }

    const queryString = Object.keys(cleanParams).length > 0
      ? '?' + new URLSearchParams(cleanParams).toString()
      : ''

    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': `mumin-api-sdk/1.0.0`,
      'X-Mumin-SDK': '1.0.0', // Custom header to track usage
      ...options?.headers,
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(url + queryString, {
          method,
          headers,
          body: options?.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          await this.handleErrorResponse(response)
        }

        // Handle 204 No Content
        if (response.status === 204) {
          return {} as T
        }

        const validResponse = await response.json()
        // Automatically unwrap { success: true, data: ..., meta: ... } response wrapper
        if (validResponse && typeof validResponse === 'object' && 'data' in validResponse) {
            return (validResponse as any).data as T
        }
        return validResponse as T
      } catch (error) {
        lastError = error as Error

        // Don't retry on 4xx errors (except 429)
        if (error instanceof AuthenticationError || error instanceof NotFoundError) {
          throw error
        }
        
        // If it's a 429, we might want to respect retry-after, but for now we just treat it as non-retriable or use standard backoff
        // (Implementation choice: usually we stop on 429 unless we have smart waiting logic)

        // Wait before retry (exponential backoff)
        if (attempt < this.retries) {
          const delay = this.retryDelay * Math.pow(2, attempt)
          await this.sleep(delay)
        }
      }
    }

    throw new MuminAPIError(
      `Request failed after ${this.retries + 1} attempts: ${lastError?.message}`,
      500
    )
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }

    const message = errorData.message || errorData.error || 'Unknown error'
    const statusCode = response.status

    if (statusCode === 401) throw new AuthenticationError(message)
    if (statusCode === 404) throw new NotFoundError(message)
    if (statusCode === 429) throw new RateLimitError(message)

    throw new MuminAPIError(message, statusCode, errorData)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
