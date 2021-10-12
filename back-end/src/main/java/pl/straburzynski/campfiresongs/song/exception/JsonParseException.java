package pl.straburzynski.campfiresongs.song.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.straburzynski.campfiresongs.exception.CustomException;
import pl.straburzynski.campfiresongs.exception.ErrorResponse;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class JsonParseException extends CustomException {

    public JsonParseException(String methodName) {
        super(ErrorResponse.builder()
                .message("JSON parse exception on method: " + methodName)
                .build());
    }
}
