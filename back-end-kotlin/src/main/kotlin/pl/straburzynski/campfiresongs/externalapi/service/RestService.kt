package pl.straburzynski.campfiresongs.externalapi.service

import java.util.logging.Logger
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import pl.straburzynski.campfiresongs.config.AppConfig
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiResponse
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong
import pl.straburzynski.campfiresongs.externalapi.service.parser.SpiewnikWywrotaParserService
import pl.straburzynski.campfiresongs.externalapi.service.parser.UltimateGuitarParserService

@Service
class RestService(
    val appConfig: AppConfig,
    val restTemplate: RestTemplate,
    val scrapper: SongScrapperService,
) {
    fun searchByTitle(title: String): List<ExternalApiSong> = runBlocking {
        val spiewnikWywrotaSongs = async { searchSongsOnSpiewnikWywrota(title) }
        val ultimateGuitarSongs = async { searchSongsOnUltimateGuitar(title) }
        listOf(spiewnikWywrotaSongs.await(), ultimateGuitarSongs.await()).flatten()
    }

    private suspend fun searchSongsOnSpiewnikWywrota(title: String): List<ExternalApiSong> {
        val url = "${appConfig.externalApiUrlSpiewnikWywrota}$title"
        return try {
            val response = withContext(Dispatchers.IO) {
                restTemplate.getForObject(url, ExternalApiResponse::class.java)
            }
            SpiewnikWywrotaParserService.parseSearchResults(response)
        } catch (ex: Exception) {
            logger.info("External API error: cannot search songs: Spiewnik Wywrota - $title")
            emptyList()
        }
    }

    private suspend fun searchSongsOnUltimateGuitar(title: String): List<ExternalApiSong> {
        try {
            val searchUrl = "${appConfig.externalApiUrlUltimateGuitar}$title"
            val document = withContext(Dispatchers.IO) {
                scrapper.getDocumentByUrl(searchUrl)
            }
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
