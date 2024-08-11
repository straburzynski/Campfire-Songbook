package pl.straburzynski.campfiresongs.song.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import java.util.UUID


@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
class CannotDeleteSongException(id: UUID) : CustomException(
    ErrorResponse(
        mapOf("id" to id),
        "exception.cannot_delete_song",
        "Cannot delete song with id $id"
    ),
)