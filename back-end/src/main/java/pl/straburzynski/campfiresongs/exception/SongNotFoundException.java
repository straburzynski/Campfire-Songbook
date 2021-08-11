package pl.straburzynski.campfiresongs.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SongNotFoundException extends RuntimeException {

    public SongNotFoundException(UUID id) {
        super("Song with id " + id + " not found");
    }
}
