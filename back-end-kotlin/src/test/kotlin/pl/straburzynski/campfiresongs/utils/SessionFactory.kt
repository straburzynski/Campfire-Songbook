package pl.straburzynski.campfiresongs.utils

import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.reactive.server.returnResult
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.session.model.SessionDto
import pl.straburzynski.campfiresongs.song.model.SongDto


object SessionFactory {

    fun createSession(
        client: WebTestClient,
        requestBody: String = createNewSessionPayload()
    ): SessionDto = checkNotNull(
        client.post()
            .uri("/sessions")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(requestBody))
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .returnResult<SessionDto>()
            .responseBody
            .blockFirst()
    )

    fun updateSession(
        client: WebTestClient,
        requestBody: SessionDto
    ) = client.put()
        .uri("/sessions")
        .contentType(MediaType.APPLICATION_JSON)
        .body(BodyInserters.fromValue(requestBody))
        .accept(MediaType.APPLICATION_JSON)
        .exchange()
        .returnResult<SessionDto>()
        .responseBody
        .blockFirst()

    private val DEFAULT_SONG = SongDto(
        id = null,
        author = "song author",
        title = "song title",
        lyrics = "song lyrics",
    )

    fun createNewSessionPayload(name: String = "session name", password: String = ""): String =
        "{ \"name\": \"$name\", \"password\": \"$password\" }"

    fun createSessionWithSavedSongPayload(
        name: String = "session name",
        password: String = "",
        songDto: SongDto?
    ): SessionDto = SessionDto(
        id = null,
        song = songDto ?: DEFAULT_SONG,
        name = name,
        password = password,
        temporary = false,
        songData = null
    )
}
