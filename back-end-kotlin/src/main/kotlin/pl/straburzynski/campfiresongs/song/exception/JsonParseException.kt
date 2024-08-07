package pl.straburzynski.campfiresongs.song.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse

@ResponseStatus(HttpStatus.BAD_REQUEST)
class JsonParseException(methodName: String) : CustomException(
    ErrorResponse(
        emptyMap(),
        "exception.json_parse_exception",
        "JSON parse exception on method: $methodName"
    )
)