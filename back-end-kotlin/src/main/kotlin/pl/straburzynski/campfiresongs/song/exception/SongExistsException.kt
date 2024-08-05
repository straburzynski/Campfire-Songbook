package pl.straburzynski.campfiresongs.song.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import pl.straburzynski.campfiresongs.song.model.Song

@ResponseStatus(HttpStatus.BAD_REQUEST)
class SongExistsException(song: Song) : CustomException(
    ErrorResponse(
        mapOf("song" to song),
        "exception.song_exists",
        "Song " + song.title + " by author " + song.author + " already exists in database"
    ),
)