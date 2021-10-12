package pl.straburzynski.campfiresongs.song.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.straburzynski.campfiresongs.exception.CustomException;
import pl.straburzynski.campfiresongs.exception.ErrorResponse;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SongNotFoundException extends CustomException {

    public SongNotFoundException(UUID id) {
        super(ErrorResponse.builder()
                .message("Song with id " + id + " not found")
                .build());
    }
}
