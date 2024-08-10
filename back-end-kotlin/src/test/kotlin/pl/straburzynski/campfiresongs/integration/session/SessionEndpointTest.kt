package pl.straburzynski.campfiresongs.integration.session

import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus.OK
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.session.model.SessionDto
import pl.straburzynski.campfiresongs.song.model.SongDto
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

    @Test
    fun `should find existing session by name`() {
        // given
        val createdSession = createSession(client, createNewSessionPayload())

        // when
        val response = client.get()
            .uri("/sessions/${createdSession.name}")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.id").isEqualTo(createdSession.id.toString())
            .jsonPath("$.name").isEqualTo(createdSession.name)
    }

    @Test
    fun `should update existing session with no song`() {
        // given
        val createdSession = createSession(client, createNewSessionPayload(password = "pass"))
        val newSession = SessionDto(
            createdSession.id,
            null,
            createdSession.name,
            null,
            false,
            null
        )

        // when
        val response = client.put()
            .uri("/sessions")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(newSession))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.id").isEqualTo(createdSession.id.toString())
            .jsonPath("$.name").isEqualTo(createdSession.name)
            .jsonPath("$.password").doesNotExist()
            .jsonPath("$.song").doesNotExist()
            .jsonPath("$.songData").doesNotExist()
            .jsonPath("$.temporary").isEqualTo(false)
    }

    @Test
    fun `should update existing session with temporary song`() {
        // given
        val createdSession = createSession(client, createNewSessionPayload(password = "pass"))
        val temporarySong = SongDto(
            id = null,
            author = "test author",
            title = "test title",
            lyrics = "test lyrics"
        )

        val updateSessionPayload = SessionDto(
            createdSession.id,
            temporarySong,
            createdSession.name,
            null,
            true,
            null
        )

        // when
        val response = client.put()
            .uri("/sessions")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(updateSessionPayload))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.id").isEqualTo(createdSession.id.toString())
            .jsonPath("$.name").isEqualTo(createdSession.name)
            .jsonPath("$.password").doesNotExist()
            .jsonPath("$.song.id").doesNotExist()
            .jsonPath("$.song.title").isEqualTo(temporarySong.title)
            .jsonPath("$.song.author").isEqualTo(temporarySong.author)
            .jsonPath("$.song.lyrics").isEqualTo(temporarySong.lyrics)
            .jsonPath("$.songData").doesNotExist()
            .jsonPath("$.temporary").isEqualTo(true)
    }
}
