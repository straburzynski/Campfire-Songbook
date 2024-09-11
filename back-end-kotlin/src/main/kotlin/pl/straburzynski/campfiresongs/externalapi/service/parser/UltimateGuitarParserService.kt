package pl.straburzynski.campfiresongs.externalapi.service.parser

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.JsonNode
import java.util.logging.Logger
import java.util.regex.Pattern
import java.util.stream.Collectors.toList
import java.util.stream.StreamSupport
import org.jsoup.nodes.Document
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource
import pl.straburzynski.campfiresongs.utils.objectMapper

class UltimateGuitarParserService {

    companion object {
        private val logger: Logger = Logger.getLogger(this::class.java.name)

        private const val JS_STORE_CLASS: String = "js-store"
        private const val DATA_CONTENT_ATTRIBUTE: String = "data-content"

        private const val STORE_NODE: String = "store"
        private const val PAGE_NODE: String = "page"
        private const val DATA_NODE: String = "data"
        private const val TAB_VIEW_NODE: String = "tab_view"
        private const val WIKI_TAB_NODE: String = "wiki_tab"
        private const val CONTENT_NODE: String = "content"
        private const val RESULTS_NODE: String = "results"
        private const val MARKETING_TYPE_NODE: String = "marketing_type"
        private const val ARTIST_NAME_NODE: String = "artist_name"
        private const val SONG_NAME_NODE: String = "song_name"
        private const val RATING_NODE: String = "rating"
        private const val TAB_URL_NODE: String = "tab_url"

        private val TAB_REGEX = Pattern.compile("\\[tab]|\\[/tab]|\\[ch]|\\[/ch]").toRegex()

        fun parseLyricsFromDocument(document: Document): String {
            return try {
                val dataNode: JsonNode = getJsonDataNode(document)
                dataNode[TAB_VIEW_NODE][WIKI_TAB_NODE][CONTENT_NODE].asText().replace(TAB_REGEX, "")
            } catch (ex: JsonProcessingException) {
                throw ExternalApiException("Ultimate-Guitar - cannot parse json node data")
            }
        }

        fun parseSearchResults(document: Document): List<ExternalApiSong> {
            try {
                val dataNode: JsonNode = getJsonDataNode(document)
                val rawResults = dataNode[RESULTS_NODE]
                return StreamSupport
                    .stream(rawResults.spliterator(), false)
                    .filter { song -> !song.has(MARKETING_TYPE_NODE) }
                    .collect(toList())
                    .groupBy { it.get(ARTIST_NAME_NODE) }
                    .map { song -> song.value.maxBy { it.get(RATING_NODE).asInt() } }
                    .map {
                        ExternalApiSong(
                            it.get(SONG_NAME_NODE).textValue(),
                            it.get(TAB_URL_NODE).textValue(),
                            it.get(ARTIST_NAME_NODE).textValue(),
                            ExternalApiSource.ULTIMATE_GUITAR,
                        )
                    }
                    .sortedBy { it.artist }
            } catch (ex: JsonProcessingException) {
                logger.info("Parse search results Ultimate-Guitar - cannot parse json node data")
                return emptyList()
            }
        }

        fun getJsonDataNode(document: Document): JsonNode {
            val element = document.getElementsByClass(JS_STORE_CLASS).first()
                ?: throw ExternalApiException("Parse Ultimate-Guitar - cannot get js_store class element")
            val dataContentJson = element.attr(DATA_CONTENT_ATTRIBUTE)
            val jsonNode = objectMapper.readTree(dataContentJson)
            return jsonNode[STORE_NODE][PAGE_NODE][DATA_NODE]
        }
    }
}
