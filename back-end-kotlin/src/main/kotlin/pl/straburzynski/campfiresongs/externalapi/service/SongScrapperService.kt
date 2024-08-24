package pl.straburzynski.campfiresongs.externalapi.service

import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.springframework.stereotype.Service
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException

@Service
class SongScrapperService {
    fun getDocumentByUrl(url: String): Document {
        return try {
            Jsoup.connect(url).get()
        } catch (ex: Exception) {
            throw ExternalApiException("getDocumentByUrl")
        }
    }
}