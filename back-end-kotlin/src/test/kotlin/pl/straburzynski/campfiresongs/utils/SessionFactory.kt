package pl.straburzynski.campfiresongs.utils

import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.reactive.server.returnResult
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.session.model.SessionDto


object SessionFactory {

    fun createSession(
        client: WebTestClient,
        requestBody: String = createNewSessionPayload()
    ): SessionDto = checkNotNull(
        client.post()
            .uri("/sessions")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(requestBody))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .returnResult<SessionDto>()
            .responseBody
            .blockFirst()
    )

    fun createNewSessionPayload(name: String = "session name", password: String = ""): String =
        "{ \"name\": \"$name\", \"password\": \"$password\" }"
}
