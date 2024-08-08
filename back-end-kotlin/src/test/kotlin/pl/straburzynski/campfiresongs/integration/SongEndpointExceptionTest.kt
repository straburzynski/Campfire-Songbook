package pl.straburzynski.campfiresongs.integration

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.test.web.reactive.server.expectBody
import org.springframework.web.reactive.function.BodyInserters.fromValue
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import pl.straburzynski.campfiresongs.utils.SongFactory.createSong
import pl.straburzynski.campfiresongs.utils.SongFactory.createSongPayload
import pl.straburzynski.campfiresongs.utils.SongFactory.createSongPayloadWithId
import java.util.UUID.randomUUID


class SongEndpointExceptionTest : BaseIntegrationTest() {
    @Test
    fun `should throw song already exists exception`() {
        // given
        val fieldValue = "test"
        val payload = createSongPayload(fieldValue)
        createSong(client, payload)

        // when
        val response = client.post()
            .uri("/songs")
            .contentType(APPLICATION_JSON)
            .body(fromValue(payload))
            .accept(APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(UNPROCESSABLE_ENTITY)
            .expectBody<ErrorResponse>()
            .consumeWith {
                it.responseBody?.params?.size shouldBe 1
                it.responseBody?.translationKey shouldBe "exception.song_exists"
                it.responseBody?.message shouldBe "Song $fieldValue by author $fieldValue already exists in database"
            }
    }

    @Test
    fun `should throw cannot update song exception`() {
        // given
        createSong(client)
        val nonExistingId = randomUUID()
        val fieldValue = "test"
        val updateSongPayload = createSongPayloadWithId(nonExistingId, fieldValue)

        // when
        val response = client.put()
            .uri("/songs/$nonExistingId")
            .contentType(APPLICATION_JSON)
            .body(fromValue(updateSongPayload))
            .accept(APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(UNPROCESSABLE_ENTITY)
            .expectBody<ErrorResponse>()
            .consumeWith {
                it.responseBody?.params?.size shouldBe 1
                it.responseBody?.params?.get("id") shouldBe nonExistingId.toString()
                it.responseBody?.translationKey shouldBe "exception.cannot_update_song"
                it.responseBody?.message shouldBe "Cannot update song with id $nonExistingId, title $fieldValue by author $fieldValue"
            }
    }

    @Test
    fun `should throw song not found exception`() {
        // given
        val nonExistingId = randomUUID()

        // when
        val response = client.get()
            .uri("/songs/$nonExistingId")
            .accept(APPLICATION_JSON)
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
