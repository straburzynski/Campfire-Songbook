package pl.straburzynski.campfiresongs.integration

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.reactive.server.expectBody
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.exception.ErrorResponse
import pl.straburzynski.campfiresongs.utils.SongFactory.DEFAULT_SONG_PAYLOAD
import pl.straburzynski.campfiresongs.utils.SongFactory.createSong


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class SongControllerExceptionTest(@Autowired val client: WebTestClient) {

    @Test
    fun `should throw song already exists exception`() {
        // given
        createSong(client, DEFAULT_SONG_PAYLOAD)

        // when
        val response = client.post()
            .uri("/songs")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(DEFAULT_SONG_PAYLOAD))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(422)
            .expectBody<ErrorResponse>()
            .consumeWith {
                it.responseBody?.translationKey shouldBe "exception.song_exists"
                it.responseBody?.message shouldBe "Song test title by author test author already exists in database"
            }
    }
}
