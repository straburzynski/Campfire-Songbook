package pl.straburzynski.campfiresongs.integration

import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.utils.SongFactory.createMultipleSongs
import java.util.logging.Logger


class SongControllerTest : BaseIntegrationTest() {

    @Test
    fun `should create new song`() {
        // given
        val requestBody = """
            {
              "title": "test title",
              "author": "test author",
              "lyrics": "test lyrics"
            }
        """.trimIndent()

        // when
        val response = client.post()
            .uri("/songs")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(requestBody))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().is2xxSuccessful
            .expectBody()
            .jsonPath("$.id").isNotEmpty()
            .jsonPath("$.title").isEqualTo("test title")
            .jsonPath("$.author").isEqualTo("test author")
            .jsonPath("$.lyrics").isEqualTo("test lyrics")
    }

    @Test
    fun `should find all songs `() {
        // given
        createMultipleSongs(client, 5)

        // when
        val response = client.get()
            .uri("/songs")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.length()").isEqualTo(5)
    }

    companion object {
        val logger: Logger = Logger.getLogger(this::class.java.name)
    }
}
