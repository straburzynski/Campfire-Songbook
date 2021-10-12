package pl.straburzynski.campfiresongs.externalapi.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException;

@Service
public class ExternalApiSongScrapperService {

    public Document getDocumentByUrl(String url) {
        try {
            return Jsoup.connect(url).get();
        } catch (Exception e) {
            throw new ExternalApiException("getDocumentByUrl");
        }
    }
}
