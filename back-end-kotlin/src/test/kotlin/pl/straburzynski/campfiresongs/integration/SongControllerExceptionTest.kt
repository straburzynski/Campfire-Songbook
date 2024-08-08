package pl.straburzynski.campfiresongs.integration

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY
import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.reactive.server.expectBody
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import pl.straburzynski.campfiresongs.utils.SongFactory
import pl.straburzynski.campfiresongs.utils.SongFactory.DEFAULT_NEW_SONG_PAYLOAD
import pl.straburzynski.campfiresongs.utils.SongFactory.createSong
import java.util.UUID


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class SongControllerExceptionTest(@Autowired val client: WebTestClient) {

    @Test
    fun `should throw song already exists exception`() {
        // given
        createSong(client, DEFAULT_NEW_SONG_PAYLOAD)

        // when
        val response = client.post()
            .uri("/songs")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(DEFAULT_NEW_SONG_PAYLOAD))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(UNPROCESSABLE_ENTITY)
            .expectBody<ErrorResponse>()
            .consumeWith {
                it.responseBody?.translationKey shouldBe "exception.song_exists"
                it.responseBody?.message shouldBe "Song test title by author test author already exists in database"
            }
    }

    @Test
    fun `should throw cannot update song exception`() {
        // given
        createSong(client, DEFAULT_NEW_SONG_PAYLOAD)
        val nonExistingId = UUID.randomUUID()
        val updateSongPayload = SongFactory.createSongPayloadWithId(nonExistingId)

        // when
        val response = client.put()
            .uri("/songs/$nonExistingId")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(updateSongPayload))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(UNPROCESSABLE_ENTITY)
            .expectBody<ErrorResponse>()
            .consumeWith {
                it.responseBody?.params?.size shouldBe 1
                it.responseBody?.params?.get("id") shouldBe nonExistingId.toString()
                it.responseBody?.translationKey shouldBe "exception.cannot_update_song"
                it.responseBody?.message shouldBe "Cannot update song with id $nonExistingId, title test title by author test author"
            }
    }

    @Test
    fun `should throw song not found exception`() {
        // given
        val nonExistingId = UUID.randomUUID()

        // when
        val response = client.get()
            .uri("/songs/$nonExistingId")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(NOT_FOUND)
            .expectBody<ErrorResponse>()
            .consumeWith {
                it.responseBody?.params shouldBe emptyMap()
                it.responseBody?.translationKey shouldBe "exception.song_not_found"
                it.responseBody?.message shouldBe "Song with id $nonExistingId not found"
            }
    }
}
