package pl.straburzynski.campfiresongs.externalapi.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException;

import java.io.IOException;

@Service
public class ExternalApiSongScrapperService {

    public Document getDocumentByUrl(String url) {
        try {
            return Jsoup.connect(url).get();
        } catch (IOException e) {
            throw new ExternalApiException("getDocumentByUrl");
        }
    }
}
