package pl.straburzynski.campfiresongs.integration.externalapi

import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus.OK
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.web.reactive.function.BodyInserters
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.SPIEWNIK_WYWROTA
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.ULTIMATE_GUITAR
import pl.straburzynski.campfiresongs.utils.Utils.getResourceAsText
import pl.straburzynski.campfiresongs.utils.WiremockStubs.stubGetSpiewnikWywrotaSearchResults
import pl.straburzynski.campfiresongs.utils.WiremockStubs.stubGetSpiewnikWywrotaSongPage
import pl.straburzynski.campfiresongs.utils.WiremockStubs.stubGetUltimateGuitarSearchResults
import pl.straburzynski.campfiresongs.utils.WiremockStubs.stubGetUltimateGuitarSongPage


class ExternalApiEndpointTest : BaseIntegrationTest() {

    @Test
    fun `should search songs by title using all sources with correct responses`() {
        // given
        stubGetSpiewnikWywrotaSearchResults(status = 200)
        stubGetUltimateGuitarSearchResults(status = 200)

        // when
        val response = client.get()
            .uri("/external/search?title=test")
            .accept(APPLICATION_JSON)
            .exchange()

        //   then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.length()").isEqualTo(10)
            .jsonPath("$[0].title").isEqualTo("Dust in the Wind")
            .jsonPath("$[0].url").isEqualTo("https://spiewnik.wywrota.pl/kansas/dust-in-the-wind")
            .jsonPath("$[0].artist").isEqualTo("Kansas")
            .jsonPath("$[0].source").isEqualTo(SPIEWNIK_WYWROTA.name)
            .jsonPath("$[1].title").isEqualTo("Dust In The Wind")
            .jsonPath("$[1].url")
            .isEqualTo("https://tabs.ultimate-guitar.com/tab/george-ogilvie/dust-in-the-wind-chords-1852090")
            .jsonPath("$[1].artist").isEqualTo("George Ogilvie")
            .jsonPath("$[1].source").isEqualTo(ULTIMATE_GUITAR.name)
    }

    @Test
    fun `should search songs by title using all sources with partial incorrect responses`() {
        // given
        stubGetSpiewnikWywrotaSearchResults(status = 200)
        stubGetUltimateGuitarSearchResults(status = 500)

        // when
        val response = client.get()
            .uri("/external/search?title=test")
            .accept(APPLICATION_JSON)
            .exchange()

        //   then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.length()").isEqualTo(1)
            .jsonPath("$[0].title").isEqualTo("Dust in the Wind")
            .jsonPath("$[0].url").isEqualTo("https://spiewnik.wywrota.pl/kansas/dust-in-the-wind")
            .jsonPath("$[0].artist").isEqualTo("Kansas")
            .jsonPath("$[0].source").isEqualTo(SPIEWNIK_WYWROTA.name)
    }

    @Test
    fun `should search songs by title using all sources with incorrect responses`() {
        // given
        stubGetSpiewnikWywrotaSearchResults(status = 500)
        stubGetUltimateGuitarSearchResults(status = 500)

        // when
        val response = client.get()
            .uri("/external/search?title=test")
            .accept(APPLICATION_JSON)
            .exchange()

        //   then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.length()").isEqualTo(0)
    }

    @Test
    fun `should parse song from url for Ultimate Guitar source`() {
        // given
        stubGetUltimateGuitarSongPage(status = 200)
        val song = ExternalApiSong(
            "Dust In The Wind",
            "http://localhost:8099/ultimate-guitar.com/tab/kansas/dust-in-the-wind-chords-50293",
            "Kansas",
            ULTIMATE_GUITAR
        )
        val expectedSongLyrics = getResourceAsText("/testData/sources/ultimateguitar/ultimateGuitarExpectedSongLyrics.txt")

        // when
        val response = client.post()
            .uri("/external/parse")
            .contentType(APPLICATION_JSON)
            .body(BodyInserters.fromValue(song))
            .accept(APPLICATION_JSON)
            .exchange()

        //   then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.id").exists()
            .jsonPath("$.author").isEqualTo(song.artist)
            .jsonPath("$.title").isEqualTo(song.title)
            .jsonPath("$.lyrics").isEqualTo(expectedSongLyrics)
    }

    @Test
    fun `should parse song from url for Spiewnik Wywrota source`() {
        // given
        stubGetSpiewnikWywrotaSongPage(status = 200)
        val song = ExternalApiSong(
            "What's Up",
            "http://localhost:8099/spiewnik.wywrota.pl/4-non-blondes/what-s-up",
            "4 Non Blondes",
            SPIEWNIK_WYWROTA
        )
        val expectedSongLyrics = getResourceAsText("/testData/sources/spiewnikwywrota/spiewnikWywrotaExpectedSongLyrics.txt")

        // when
        val response = client.post()
            .uri("/external/parse")
            .contentType(APPLICATION_JSON)
            .body(BodyInserters.fromValue(song))
            .accept(APPLICATION_JSON)
            .exchange()


        //   then
        response
            .expectStatus().isEqualTo(OK).expectBody()
            .jsonPath("$.id").exists()
            .jsonPath("$.author").isEqualTo(song.artist)
            .jsonPath("$.title").isEqualTo(song.title)
            .jsonPath("$.lyrics").isEqualTo(expectedSongLyrics)
    }

}
