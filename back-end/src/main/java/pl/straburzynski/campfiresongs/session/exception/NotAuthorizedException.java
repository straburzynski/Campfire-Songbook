package pl.straburzynski.campfiresongs.session.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class NotAuthorizedException extends RuntimeException {

    public NotAuthorizedException() {
        super("Not authorized");
    }
}
