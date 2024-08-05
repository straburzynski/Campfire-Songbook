package pl.straburzynski.campfiresongs.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.stream.Stream

@ControllerAdvice(annotations = [RestController::class])
class ExceptionHandlerController {
    @ExceptionHandler(CustomException::class)
    fun handle(exception: CustomException): ResponseEntity<ErrorResponse> {
        val status = Stream.of(
            *exception.javaClass
                .annotations
        )
            .filter { annotation: Annotation? -> annotation is ResponseStatus }
            .map { obj: Annotation? ->
                ResponseStatus::class.java.cast(
                    obj
                )
            }
            .map { obj: ResponseStatus -> obj.value }
            .findFirst()
            .orElse(HttpStatus.BAD_REQUEST)

        return ResponseEntity.status(status)
            .body(exception.errorResponse)
    }
}