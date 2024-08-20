package pl.straburzynski.campfiresongs.integration.externalapi

import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus.OK
import org.springframework.http.MediaType.APPLICATION_JSON
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.SPIEWNIK_WYWROTA
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.ULTIMATE_GUITAR
import pl.straburzynski.campfiresongs.utils.WiremockStubs.stubGetSpiewnikWywrotaSearchResults
import pl.straburzynski.campfiresongs.utils.WiremockStubs.stubGetUltimateGuitarSearchResults


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
}
