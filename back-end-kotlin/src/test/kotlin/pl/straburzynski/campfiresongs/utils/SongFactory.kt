package pl.straburzynski.campfiresongs.utils

import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.reactive.function.BodyInserters

object SongFactory {
    fun createSong(
        client: WebTestClient,
        requestBody: String = DEFAULT_SONG_PAYLOAD
    ) {
        client.post()
            .uri("/songs")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(requestBody))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
    }

    fun createMultipleSongs(client: WebTestClient, count: Int) =
        (1..count).forEach { _ -> createSong(client, createSongPayload(randomString(5))) }

    fun randomString(length: Int) =
        ('a'..'z').map { it }.shuffled().subList(0, length).joinToString("")

    fun createSongPayload(value: String): String =
        "{ \"title\": \"$value\", \"author\": \"$value\", \"lyrics\": \"$value\"}"

    const val DEFAULT_SONG_PAYLOAD =
        "{ \"title\": \"test title\", \"author\": \"test author\", \"lyrics\": \"test lyrics\"}"

}

