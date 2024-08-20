package pl.straburzynski.campfiresongs.utils

import com.github.tomakehurst.wiremock.client.WireMock.aResponse
import com.github.tomakehurst.wiremock.client.WireMock.equalTo
import com.github.tomakehurst.wiremock.client.WireMock.get
import com.github.tomakehurst.wiremock.client.WireMock.stubFor
import com.github.tomakehurst.wiremock.client.WireMock.urlPathMatching
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiResponse
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.SPIEWNIK_WYWROTA
import pl.straburzynski.campfiresongs.utils.Utils.getResourceAsText

object WiremockStubs {

    private val defaultSpiewnikWywrotaExternalApiSongList = listOf(
        ExternalApiSong(
            "Dust in the Wind",
            "https://spiewnik.wywrota.pl/kansas/dust-in-the-wind",
            "Kansas",
            source = SPIEWNIK_WYWROTA
        )
    )
    private const val ultimateGuitarDocumentSearchResultPath = "/testData/UltimateGuitarSearchResults.html"
    private val defaultUltimateGuitarDocument = getResourceAsText(ultimateGuitarDocumentSearchResultPath)

    fun stubGetUltimateGuitarSearchResults(status: Int = 200, document: String? = null) {
        stubFor(
            get(urlPathMatching(".*/ultimate-guitar.com/search.php"))
                .withQueryParam("type", equalTo("300"))
                .withQueryParam("title", equalTo("test"))
                .willReturn(
                    aResponse()
                        .withStatus(status)
                        .withBody(document ?: defaultUltimateGuitarDocument)
                )
        )
    }

    fun stubGetSpiewnikWywrotaSearchResults(status: Int = 200, songDtos: List<ExternalApiSong>? = null) {
        stubFor(
            get(urlPathMatching(".*/api.wywrota.pl/api/suggest"))
                .withQueryParam("q", equalTo("test"))
                .willReturn(
                    aResponse()
                        .withStatus(status)
                        .withHeader("Content-Type", "application/json")
                        .withBody(
                            objectMapper.writeValueAsString(
                                ExternalApiResponse(
                                    artists = emptyList(),
                                    songs = songDtos ?: defaultSpiewnikWywrotaExternalApiSongList
                                )
                            )
                        )
                )
        )
    }

}