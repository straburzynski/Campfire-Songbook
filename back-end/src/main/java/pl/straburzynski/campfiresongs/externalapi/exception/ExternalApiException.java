package pl.straburzynski.campfiresongs.externalapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class ExternalApiException extends RuntimeException {

    public ExternalApiException(String message) {
        super("External Api Exception: " + message);
    }
}
