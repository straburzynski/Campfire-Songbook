package pl.straburzynski.campfiresongs.song.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import pl.straburzynski.campfiresongs.song.model.SongDto


@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
class CannotUpdateSongException(songDto: SongDto) : CustomException(
    ErrorResponse(
        mapOf("song" to songDto),
        "exception.cannot_update_song",
        "Cannot update song " + songDto.title + " by author " + songDto.author
    ),
)