package ink.mumin.sdk.models

import kotlinx.serialization.Serializable

@Serializable
data class Hadith(
    val id: Int,
    val collectionId: String,
    val bookNumber: String,
    val chapterId: String,
    val hadithNumber: String,
    val hadithNumberInt: Int? = null,
    val label: String? = null,
    val arabicText: String? = null,
    val english: String? = null,
    val russian: String? = null,
    val translation: Translation? = null
)

@Serializable
data class Translation(
    val id: Int,
    val text: String,
    val languageCode: String,
    val narrator: String? = null
)

@Serializable
data class Collection(
    val slug: String,
    val name: String,
    val totalHadiths: Int,
    val description: String? = null
)

@Serializable
data class PaginatedResponse<T>(
    val data: List<T>,
    val meta: Meta
)

@Serializable
data class Meta(
    val total: Int,
    val page: Int,
    val limit: Int,
    val totalPages: Int
)
