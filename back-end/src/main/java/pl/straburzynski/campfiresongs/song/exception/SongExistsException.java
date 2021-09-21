package pl.straburzynski.campfiresongs.song.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.straburzynski.campfiresongs.song.model.Song;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SongExistsException extends RuntimeException {

    public SongExistsException(Song song) {
        super("Song " + song.getTitle() + " by author " + song.getAuthor() + " already exists in database");
    }
}
