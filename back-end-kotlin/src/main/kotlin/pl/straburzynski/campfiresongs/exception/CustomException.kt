package pl.straburzynski.campfiresongs.exception

open class CustomException(val errorResponse: ErrorResponse) : RuntimeException(
    errorResponse.message
)