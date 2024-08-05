package pl.straburzynski.campfiresongs.exception

data class ErrorResponse(
    val params: Map<String, Any>,
    val translationKey: String,
    val message: String,
)
