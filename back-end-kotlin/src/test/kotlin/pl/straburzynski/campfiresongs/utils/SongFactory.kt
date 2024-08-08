package pl.straburzynski.campfiresongs.utils

import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.reactive.server.returnResult
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.song.model.SongDto
import java.util.UUID

object SongFactory {
    fun createSong(
        client: WebTestClient,
        requestBody: String = DEFAULT_NEW_SONG_PAYLOAD
    ): SongDto? = client.post()
        .uri("/songs")
        .contentType(MediaType.APPLICATION_JSON)
        .body(BodyInserters.fromValue(requestBody))
        .accept(MediaType.APPLICATION_JSON)
        .exchange()
        .returnResult<SongDto>()
        .responseBody
        .blockFirst()

    fun createMultipleSongs(client: WebTestClient, count: Int) =
        (1..count).forEach { _ -> createSong(client, createSongPayloadWithId(randomString(5))) }

    fun randomString(length: Int) =
        ('a'..'z').map { it }.shuffled().subList(0, length).joinToString("")

    fun createSongPayloadWithId(value: String): String =
        "{ \"title\": \"$value\", \"author\": \"$value\", \"lyrics\": \"$value\"}"

    const val DEFAULT_NEW_SONG_PAYLOAD =
        "{ \"title\": \"test title\", \"author\": \"test author\", \"lyrics\": \"test lyrics\"}"

    fun createSongPayloadWithId(id: UUID) =
        "{ \"id\": \"$id\", \"title\": \"test title\", \"author\": \"test author\", \"lyrics\": \"test lyrics\"}"

}

