package pl.straburzynski.campfiresongs.session.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.straburzynski.campfiresongs.exception.CustomException;
import pl.straburzynski.campfiresongs.exception.ErrorResponse;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class NotAuthorizedException extends CustomException {

    public NotAuthorizedException() {
        super(ErrorResponse.builder()
                .message("Not authorized to session")
                .translationKey("exception.not_authorized_to_session")
                .build());
    }
}
