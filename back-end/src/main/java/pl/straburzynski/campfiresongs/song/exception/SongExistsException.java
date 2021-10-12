package pl.straburzynski.campfiresongs.song.exception;

import com.google.common.collect.ImmutableMap;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.straburzynski.campfiresongs.exception.CustomException;
import pl.straburzynski.campfiresongs.exception.ErrorResponse;
import pl.straburzynski.campfiresongs.song.model.Song;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SongExistsException extends CustomException {

    public SongExistsException(Song song) {
        super(ErrorResponse.builder()
                .message("Song " + song.getTitle() + " by author " + song.getAuthor() + " already exists in database")
                .translationKey("exception.song_exists")
                .params(ImmutableMap.of("song", song))
                .build());
    }
}
