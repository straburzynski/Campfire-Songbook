package pl.straburzynski.campfiresongs.integration.song

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus.OK
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.utils.SongFactory.buildMultipleSongs
import pl.straburzynski.campfiresongs.utils.SongFactory.createMultipleSongs
import pl.straburzynski.campfiresongs.utils.SongFactory.createSong
import pl.straburzynski.campfiresongs.utils.SongFactory.createSongPayload
import pl.straburzynski.campfiresongs.utils.SongFactory.createSongPayloadWithId


class SongEndpointTest : BaseIntegrationTest() {

    @Test
    fun `should create song`() {
        // given
        val requestBody = createSongPayload("test")

        // when
        val response = client.post()
            .uri("/songs")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(requestBody))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.id").isNotEmpty()
            .jsonPath("$.title").isEqualTo("test")
            .jsonPath("$.author").isEqualTo("test")
            .jsonPath("$.lyrics").isEqualTo("test")
    }

    @Test
    fun `should batch create songs`() {
        // given
        val songs = buildMultipleSongs(5)

        // when
        val response = client.post()
            .uri("/songs/batch")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(songs))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK)
            .expectBody()
            .jsonPath("$.length()").isEqualTo(5)
            .jsonPath("$[0].id").exists()
            .jsonPath("$[0].author").isEqualTo(songs[0].author)
            .jsonPath("$[0].title").isEqualTo(songs[0].title)
            .jsonPath("$[0].lyrics").isEqualTo(songs[0].lyrics)
    }

    @Test
    fun `should find song by id`() {
        // given
        val createdSong = createSong(client, createSongPayload())

        // when
        val response = client.get()
            .uri("/songs/${createdSong.id}")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK)
            .expectBody()
            .jsonPath("$.id").isEqualTo(createdSong.id.toString())
            .jsonPath("$.author").isEqualTo(createdSong.author)
            .jsonPath("$.title").isEqualTo(createdSong.title)
            .jsonPath("$.lyrics").isEqualTo(createdSong.lyrics)
    }

    @Test
    fun `should find all songs (default offline mode = true)`() {
        // given
        val createdSongs = createMultipleSongs(client, 5)

        // when
        val response = client.get()
            .uri("/songs")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK)
            .expectBody()
            .jsonPath("$.length()").isEqualTo(5)
            .jsonPath("$[0].id").isEqualTo(createdSongs[0].id.toString())
            .jsonPath("$[0].author").isEqualTo(createdSongs[0].author)
            .jsonPath("$[0].title").isEqualTo(createdSongs[0].title)
            .jsonPath("$[0].lyrics").isEqualTo(createdSongs[0].lyrics)
    }

    @Test
    fun `should find all songs without lyrics field (offline mode = false)`() {
        // given
        val createdSongs = createMultipleSongs(client, 5)

        // when
        val response = client.get()
            .uri("/songs?offline=false")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK)
            .expectBody()
            .jsonPath("$.length()").isEqualTo(5)
            .jsonPath("$[0].id").isEqualTo(createdSongs[0].id.toString())
            .jsonPath("$[0].title").isEqualTo(createdSongs[0].title)
            .jsonPath("$[0].author").isEqualTo(createdSongs[0].author)
            .jsonPath("$[0].lyrics").doesNotExist()
    }

    @Test
    fun `should update existing song`() {
        // given
        val createdSong = createSong(client, createSongPayload("test"))
        val id = checkNotNull(createdSong.id)
        val updatedSongFieldValue = "updated test"
        val updatePayload = createSongPayloadWithId(id, updatedSongFieldValue)

        // when
        val response = client.put()
            .uri("/songs/$id")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(updatePayload))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()

        // then
        response
            .expectStatus().isEqualTo(OK)
            .expectBody()
            .jsonPath("$.id").isEqualTo(id.toString())
            .jsonPath("$.title").isEqualTo(updatedSongFieldValue)
            .jsonPath("$.author").isEqualTo(updatedSongFieldValue)
            .jsonPath("$.lyrics").isEqualTo(updatedSongFieldValue)
    }

    @Test
    fun `should delete song not used in any session`() {
        // given
        val createdSong = createSong(client, createSongPayload())
        val id = checkNotNull(createdSong.id)

        // when
        val response = client.delete()
            .uri("/songs/$id")
            .exchange()

        // then
        response.expectStatus().isEqualTo(OK)
        songRepository.existsById(id) shouldBe false
    }
}
