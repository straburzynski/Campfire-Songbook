package pl.straburzynski.campfiresongs.utils

import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.reactive.server.returnResult
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.song.model.SongDto
import pl.straburzynski.campfiresongs.utils.Utils.randomString
import java.util.UUID

object SongFactory {
    fun createSong(
        client: WebTestClient,
        requestBody: String = createSongPayload()
    ): SongDto = checkNotNull(
        client.post()
            .uri("/songs")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(requestBody))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .returnResult<SongDto>()
            .responseBody
            .blockFirst()
    )

    fun createMultipleSongs(client: WebTestClient, count: Int): List<SongDto> =
        (1..count).map { _ -> createSong(client, createSongPayload(randomString(5))) }

    fun createSongPayloadWithId(id: UUID, value: String = "test") =
        "{ \"id\": \"$id\",  \"title\": \"$value\", \"author\": \"$value\", \"lyrics\": \"$value\"}"

    fun createSongPayload(value: String = "test"): String =
        "{ \"title\": \"$value\", \"author\": \"$value\", \"lyrics\": \"$value\"}"

    fun buildMultipleSongs(count: Int): List<SongDto> =
        (1..count).map { i ->
            SongDto(
                null,
                "${i}_${randomString(5)}",
                "${i}_${randomString(5)}",
                "${i}_${randomString(5)}"
            )
        }
}

