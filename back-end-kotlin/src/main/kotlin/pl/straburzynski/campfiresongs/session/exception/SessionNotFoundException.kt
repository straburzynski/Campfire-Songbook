package pl.straburzynski.campfiresongs.session.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import java.util.UUID


@ResponseStatus(HttpStatus.NOT_FOUND)
class SessionNotFoundException : CustomException {
    constructor(name: String) : super(
        ErrorResponse(
            mapOf("name" to name),
            "exception.session_not_found",
            "Session with name $name not found"
        ),
    )

    constructor(id: UUID?) : super(
        ErrorResponse(
            emptyMap(),
            "exception.session_not_found",
            "Session with id $id not found"
        ),
    )
    constructor() : super(
        ErrorResponse(
            emptyMap(),
            "exception.session_not_found",
            "Session not found"
        ),
    )
}
