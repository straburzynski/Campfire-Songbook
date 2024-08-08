package pl.straburzynski.campfiresongs.song.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import pl.straburzynski.campfiresongs.song.model.SongDto
import java.util.UUID


@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
class CannotUpdateSongException(id: UUID, songDto: SongDto) : CustomException(
    ErrorResponse(
        mapOf("id" to id),
        "exception.cannot_update_song",
        "Cannot update song with id $id, title ${songDto.title} by author ${songDto.author}"
    ),
)