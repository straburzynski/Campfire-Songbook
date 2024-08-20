package pl.straburzynski.campfiresongs.externalapi.service.parser

import org.jsoup.nodes.Document
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.SPIEWNIK_WYWROTA
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.ULTIMATE_GUITAR

object ParseService {
    fun parseSongFromDocument(externalApiSong: ExternalApiSong, document: Document): String {
        return when (externalApiSong.source) {
            ULTIMATE_GUITAR -> UltimateGuitarParserService.parseLyricsFromDocument(document)
            SPIEWNIK_WYWROTA -> SpiewnikWywrotaParserService.parseLyricsFromDocument(document)
            null -> throw ExternalApiException("Unknown external api source")
        }
    }
}