package pl.straburzynski.campfiresongs.externalapi.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse


@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
class ExternalApiException(message: String) : CustomException(
    ErrorResponse(
        mapOf("message" to message),
        "exception.external_api_exception",
        "External Api Exception: $message"
    )
)
