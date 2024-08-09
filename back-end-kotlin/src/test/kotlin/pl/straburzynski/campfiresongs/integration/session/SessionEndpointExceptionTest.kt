package pl.straburzynski.campfiresongs.integration.session

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus.FORBIDDEN
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.test.web.reactive.server.expectBody
import org.springframework.web.reactive.function.BodyInserters.fromValue
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import pl.straburzynski.campfiresongs.utils.SessionFactory.createSession
import pl.straburzynski.campfiresongs.utils.Utils.randomString


class SessionEndpointExceptionTest : BaseIntegrationTest() {

    @Test
    fun `should throw not authorized exception`() {
        // given
        val createdSession = createSession(client)
        val incorrectPassword = randomString(5)

        // when
        val response = client.post()
            .uri("/sessions")
            .contentType(APPLICATION_JSON)
            .body(fromValue(createdSession.copy(password = incorrectPassword)))
            .accept(APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(FORBIDDEN)
            .expectBody<ErrorResponse>()
            .consumeWith {
                it.responseBody?.params shouldBe emptyMap()
                it.responseBody?.translationKey shouldBe "exception.not_authorized_to_session"
                it.responseBody?.message shouldBe "Not authorized to session"
            }
    }
}
