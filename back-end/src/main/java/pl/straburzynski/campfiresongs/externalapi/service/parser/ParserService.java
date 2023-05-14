package pl.straburzynski.campfiresongs.externalapi.service.parser;

import org.jsoup.nodes.Document;
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;

public class ParserService {

    public static String parseSongFromDocument(ExternalApiSong externalApiSong, Document document) {
        String lyrics;
        switch (externalApiSong.getSource()) {
            case ULTIMATE_GUITAR:
                lyrics = UltimateGuitarParserService.parseLyricsFromDocument(document);
                break;
            case SPIEWNIK_WYWROTA:
                lyrics = SpiewnikWywrotaParserService.parseLyricsFromDocument(document);
                break;
            default:
                throw new ExternalApiException("Unknown external api source");
        }
        return lyrics;
    }
}
