package pl.straburzynski.campfiresongs.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Stream;

@Slf4j
@ControllerAdvice(annotations = RestController.class)
public class ExceptionHandlerController {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handle(CustomException exception) {
        HttpStatus status = Stream.of(exception.getClass()
                        .getAnnotations())
                .filter(annotation -> annotation instanceof ResponseStatus)
                .map(ResponseStatus.class::cast)
                .map(ResponseStatus::value)
                .findFirst()
                .orElse(HttpStatus.BAD_REQUEST);

        return ResponseEntity.status(status)
                .body(exception.getErrorResponse());
    }

}
