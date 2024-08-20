package pl.straburzynski.campfiresongs.externalapi.service

import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import pl.straburzynski.campfiresongs.config.AppConfig
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiResponse
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong
import pl.straburzynski.campfiresongs.externalapi.service.parser.SpiewnikWywrotaParserService
import pl.straburzynski.campfiresongs.externalapi.service.parser.UltimateGuitarParserService
import java.util.logging.Logger
import java.util.stream.Stream

@Service
class RestService(
    val appConfig: AppConfig,
    val restTemplate: RestTemplate,
    val scrapper: SongScrapperService
) {
    fun searchByTitle(title: String): List<ExternalApiSong> {
        val spiewnikWywrotaSongs = searchSongsOnSpiewnikWywrota(title)
        val ultimateGuitarSongs = searchSongsOnUltimateGuitar(title)
        val flatten = listOf(spiewnikWywrotaSongs, ultimateGuitarSongs).flatten()
        flatten
        return Stream
            .of(spiewnikWywrotaSongs, ultimateGuitarSongs)
            .flatMap(List<ExternalApiSong>::stream)
            .toList()
    }

    private fun searchSongsOnSpiewnikWywrota(title: String): List<ExternalApiSong> {
        val url = "${appConfig.externalApiUrlSpiewnikWywrota}$title"
        return try {
            val response = restTemplate.getForObject(url, ExternalApiResponse::class.java)
            SpiewnikWywrotaParserService.parseSearchResults(response)
        } catch (ex: Exception) {
            logger.info("External API error: cannot search songs: Spiewnik Wywrota - $title")
            emptyList()
        }
    }

    private fun searchSongsOnUltimateGuitar(title: String): List<ExternalApiSong> {
        try {
            val searchUrl: String = appConfig.externalApiUrlUltimateGuitar + title
            val document = scrapper.getDocumentByUrl(searchUrl)
            return UltimateGuitarParserService.parseSearchResults(document)
        } catch (ex: Exception) {
            logger.info("External API error: cannot search songs: Ultimate Guitar - $title")
            return emptyList()
        }
    }

    companion object {
        private val logger: Logger = Logger.getLogger(this::class.java.name)
    }

}