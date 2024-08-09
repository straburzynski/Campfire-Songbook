package pl.straburzynski.campfiresongs.integration.session

import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus.OK
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.utils.SessionFactory.createNewSessionPayload
import pl.straburzynski.campfiresongs.utils.SessionFactory.createSession


class SessionEndpointTest : BaseIntegrationTest() {

    @Test
    fun `should create empty session`() {
        // given
        val requestBody = createNewSessionPayload("name", "password")

        // when
        val response = client.post()
            .uri("/sessions")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(requestBody))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.id").exists()
            .jsonPath("$.name").isEqualTo("name")
    }

    @Test
    fun `should return existing session`() {
        // given
        val request = createNewSessionPayload("session name", "password")
        val createdSession = createSession(client, request)

        // when
        val response = client.post()
            .uri("/sessions")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(request))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.id").isEqualTo(createdSession.id.toString())
            .jsonPath("$.name").isEqualTo(createdSession.name)
    }
}
