package pl.straburzynski.campfiresongs.song.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import pl.straburzynski.campfiresongs.song.model.SongDto


@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
class SongExistsException(songDto: SongDto) : CustomException(
    ErrorResponse(
        mapOf("song" to songDto),
        "exception.song_exists",
        "Song " + songDto.title + " by author " + songDto.author + " already exists in database"
    ),
)