package pl.straburzynski.campfiresongs.unit.parser

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import org.jsoup.Jsoup.parse
import pl.straburzynski.campfiresongs.exception.CustomException
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.ULTIMATE_GUITAR
import pl.straburzynski.campfiresongs.externalapi.service.parser.UltimateGuitarParserService.Companion.getJsonDataNode
import pl.straburzynski.campfiresongs.externalapi.service.parser.UltimateGuitarParserService.Companion.parseLyricsFromDocument
import pl.straburzynski.campfiresongs.externalapi.service.parser.UltimateGuitarParserService.Companion.parseSearchResults
import pl.straburzynski.campfiresongs.utils.Utils.getResourceAsText


class UltimateGuitarParserServiceTest : FunSpec({

    context("UltimateGuitarParserService.getJsonDataNode") {
        test("should get json node with data") {
            // given
            val ultimateGuitarDocumentSearchResultPath = "/testData/sources/ultimateguitar/UltimateGuitarSearchResults.html"
            val document = parse(getResourceAsText(ultimateGuitarDocumentSearchResultPath))

            // when
            val res = getJsonDataNode(document)

            // then
            res shouldNotBe null
            res.get("results") shouldNotBe null
        }

        test("should throw exception when json node with data not found") {
            // given
            val ultimateGuitarIncorrectDocumentSearchResultPath = "/testData/sources/ultimateguitar/IncorrectUltimateGuitarSearchResults.html"
            val document = parse(getResourceAsText(ultimateGuitarIncorrectDocumentSearchResultPath))

            // when
            val exception = shouldThrow<CustomException> {
                getJsonDataNode(document)
            }

            // then
            exception shouldNotBe null
            with(exception.errorResponse) {
                params.size shouldBe 1
                params["message"] shouldBe "Parse Ultimate-Guitar - cannot get js_store class element"
                translationKey shouldBe "exception.external_api_exception"
                message shouldBe "External Api Exception: Parse Ultimate-Guitar - cannot get js_store class element"
            }
        }
    }

    context("UltimateGuitarParserService.parseSearchResults") {
        test("should parse search results from document") {
            // given
            val ultimateGuitarDocumentSearchResultPath = "/testData/sources/ultimateguitar/UltimateGuitarSearchResults.html"
            val document = parse(getResourceAsText(ultimateGuitarDocumentSearchResultPath))

            // when
            val searchResults = parseSearchResults(document)

            // then
            searchResults shouldNotBe null
            searchResults.size shouldBe 9
            with(searchResults[1]) {
                artist shouldBe "Kansas"
                title shouldBe "Dust In The Wind"
                url shouldBe "https://tabs.ultimate-guitar.com/tab/kansas/dust-in-the-wind-chords-50293"
                source shouldBe ULTIMATE_GUITAR
            }
        }
    }

    context("UltimateGuitarParserService.parseLyricsFromDocument") {
        test("should parse lyrics from document") {
            // given
            val ultimateGuitarDocumentSongPagePath = "/testData/sources/ultimateguitar/UltimateGuitarSongPage.html"
            val expectedSongLyricsPath = "/testData/sources/ultimateguitar/ultimateGuitarExpectedSongLyrics.txt"
            val document = parse(getResourceAsText(ultimateGuitarDocumentSongPagePath))
            val expectedSongLyrics = getResourceAsText(expectedSongLyricsPath)

            // when
            val searchResults = parseLyricsFromDocument(document)

            // then
            searchResults shouldBe expectedSongLyrics
        }
    }
})
