export class MuminAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message)
    this.name = 'MuminAPIError'
  }
}

export class AuthenticationError extends MuminAPIError {
  constructor(message: string) {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

export class RateLimitError extends MuminAPIError {
  constructor(
    message: string,
    public resetTime?: string | null
  ) {
    super(message, 429)
    this.name = 'RateLimitError'
  }
}

export class ValidationError extends MuminAPIError {
  constructor(message: string, public errors: Record<string, string[]>) {
    super(message, 400, errors)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends MuminAPIError {
  constructor(message: string) {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}
