package pl.straburzynski.campfiresongs.session.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse


@ResponseStatus(HttpStatus.FORBIDDEN)
class NotAuthorizedException : CustomException(
    ErrorResponse(
        emptyMap(),
        "exception.not_authorized_to_session",
        "Not authorized to session"
    )
)
