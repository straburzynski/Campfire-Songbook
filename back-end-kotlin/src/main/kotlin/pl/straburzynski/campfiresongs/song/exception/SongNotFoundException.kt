package pl.straburzynski.campfiresongs.song.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse


@ResponseStatus(HttpStatus.NOT_FOUND)
class SongNotFoundException(id: String) : CustomException(
    ErrorResponse(
        mapOf(),
        "exception.song_not_found",
        "Song with id $id not found"
    ),
)