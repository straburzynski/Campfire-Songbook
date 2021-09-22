package pl.straburzynski.campfiresongs.song.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class JsonParseException extends RuntimeException {

    public JsonParseException(String methodName) {
        super("JSON parse exception on method: " + methodName);
    }
}