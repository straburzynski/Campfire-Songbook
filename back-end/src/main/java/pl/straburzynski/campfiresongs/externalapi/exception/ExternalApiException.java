package pl.straburzynski.campfiresongs.externalapi.exception;

import com.google.common.collect.ImmutableMap;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.straburzynski.campfiresongs.exception.CustomException;
import pl.straburzynski.campfiresongs.exception.ErrorResponse;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class ExternalApiException extends CustomException {

    public ExternalApiException(String message) {
        super(ErrorResponse.builder()
                .message("External Api Exception: " + message)
                .translationKey("exception.external_api_exception")
                .params(ImmutableMap.of("message", message))
                .build());
    }
}
