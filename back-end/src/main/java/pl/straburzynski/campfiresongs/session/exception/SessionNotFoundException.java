package pl.straburzynski.campfiresongs.session.exception;

import com.google.common.collect.ImmutableMap;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.straburzynski.campfiresongs.exception.CustomException;
import pl.straburzynski.campfiresongs.exception.ErrorResponse;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SessionNotFoundException extends CustomException {

    public SessionNotFoundException(String name) {
        super(ErrorResponse.builder()
                .message("Session with name " + name + " not found")
                .translationKey("exception.session_not_found")
                .params(ImmutableMap.of("name", name))
                .build());
    }
}
