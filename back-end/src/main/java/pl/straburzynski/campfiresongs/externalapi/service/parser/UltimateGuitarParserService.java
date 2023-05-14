package pl.straburzynski.campfiresongs.externalapi.service.parser;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static java.util.Comparator.comparing;
import static java.util.Comparator.comparingDouble;
import static java.util.stream.Collectors.*;

@Slf4j
public class UltimateGuitarParserService {

    private final static String JS_STORE_CLASS = "js-store";

    private final static String DATA_CONTENT_ATTRIBUTE = "data-content";

    private final static String STORE_NODE = "store";
    private final static String PAGE_NODE = "page";
    private final static String DATA_NODE = "data";
    private final static String TAB_VIEW_NODE = "tab_view";
    private final static String WIKI_TAB_NODE = "wiki_tab";
    private final static String CONTENT_NODE = "content";
    private final static String RESULTS_NODE = "results";
    private final static String MARKETING_TYPE_NODE = "marketing_type";
    private final static String ARTIST_NAME_NODE = "artist_name";
    private final static String SONG_NAME_NODE = "song_name";
    private final static String RATING_NODE = "rating";
    private final static String TAB_URL_NODE = "tab_url";

    private final static String TAB_REGEX = "\\[tab]|\\[/tab]|\\[ch]|\\[/ch]";

    public static String parseLyricsFromDocument(Document document) {
        try {
            JsonNode dataNode = getJsonDataNode(document);
            return dataNode
                    .get(TAB_VIEW_NODE)
                    .get(WIKI_TAB_NODE)
                    .get(CONTENT_NODE).asText().replaceAll(TAB_REGEX, "");
        } catch (JsonProcessingException ex) {
            throw new ExternalApiException("Ultimate-Guitar - cannot parse json node data");
        }
    }

    public static List<ExternalApiSong> parseSearchResults(Document document) {
        try {
            JsonNode dataNode = getJsonDataNode(document);
            JsonNode rawResults = dataNode.get(RESULTS_NODE);
            return StreamSupport.stream(rawResults.spliterator(), false)
                    .filter(song -> !song.has(MARKETING_TYPE_NODE))
                    .collect(groupingBy(song -> song.get(ARTIST_NAME_NODE), maxBy(
                            comparingDouble(song -> song.get(RATING_NODE).asDouble())))
                    )
                    .values().stream()
                    .filter(Optional::isPresent)
                    .map(s -> {
                        JsonNode song = s.get();
                        return ExternalApiSong.builder()
                                .title(song.get(SONG_NAME_NODE).asText())
                                .url(song.get(TAB_URL_NODE).asText())
                                .artist(song.get(ARTIST_NAME_NODE).asText())
                                .source(ExternalApiSource.ULTIMATE_GUITAR).build();
                    }).sorted(comparing(ExternalApiSong::getArtist)).collect(toList());
        } catch (JsonProcessingException ex) {
            log.error("Parse search results Ultimate-Guitar - cannot parse json node data");
            return Collections.emptyList();
        }
    }

    private static JsonNode getJsonDataNode(Document document) throws JsonProcessingException {
        Element element = document.getElementsByClass(JS_STORE_CLASS).first();
        if (element == null)
            throw new ExternalApiException("Parse Ultimate-Guitar - cannot get js_store class element");
        String dataContentJson = element.attr(DATA_CONTENT_ATTRIBUTE);
        JsonNode jsonNode = new ObjectMapper().readTree(dataContentJson);
        return jsonNode
                .get(STORE_NODE)
                .get(PAGE_NODE)
                .get(DATA_NODE);
    }

}
