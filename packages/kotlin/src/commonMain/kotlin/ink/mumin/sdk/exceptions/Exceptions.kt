package ink.mumin.sdk.exceptions

sealed class MuminApiException(message: String, cause: Throwable? = null) : Exception(message, cause)

class NetworkException(message: String, cause: Throwable? = null) : MuminApiException(message, cause)

class AuthenticationError(message: String) : MuminApiException(message)

class RateLimitError(message: String) : MuminApiException(message)

class ValidationException(message: String) : MuminApiException(message)

class ServerException(val statusCode: Int, message: String) : MuminApiException("Server error ($statusCode): $message")
