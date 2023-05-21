package pl.straburzynski.campfiresongs.externalapi.service;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pl.straburzynski.campfiresongs.config.AppConfig;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiResponse;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;
import pl.straburzynski.campfiresongs.externalapi.service.parser.SpiewnikWywrotaParserService;
import pl.straburzynski.campfiresongs.externalapi.service.parser.UltimateGuitarParserService;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class RestService {

    private final RestTemplate restTemplate;
    private final AppConfig appConfig;
    private final SongScrapperService scrapper;

    public RestService(AppConfig appConfig, RestTemplate restTemplate, SongScrapperService scrapper) {
        this.appConfig = appConfig;
        this.restTemplate = restTemplate;
        this.scrapper = scrapper;
    }

    public List<ExternalApiSong> searchByTitle(String title) {
        List<ExternalApiSong> spiewnikWywrotaSongs = searchSongsOnSpiewnikWywrota(title);
        List<ExternalApiSong> ultimateGuitarSongs = searchSongsOnUltimateGuitar(title);
        return Stream
                .of(spiewnikWywrotaSongs, ultimateGuitarSongs)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }

    private List<ExternalApiSong> searchSongsOnSpiewnikWywrota(String title) {
        String url = appConfig.getExternalApiUrlSpiewnikWywrota() + title;
        try {
            ExternalApiResponse response = restTemplate.getForObject(url, ExternalApiResponse.class);
            return SpiewnikWywrotaParserService.parseSearchResults(response);
        } catch (Exception ex) {
            log.error("External API error: cannot search songs: Spiewnik Wywrota - {}", title);
            return Collections.emptyList();
        }
    }

    private List<ExternalApiSong> searchSongsOnUltimateGuitar(String title) {
        try {
            String searchUrl = appConfig.getExternalApiUrlUltimateGuitar() + title;
            Document document = scrapper.getDocumentByUrl(searchUrl);
            return UltimateGuitarParserService.parseSearchResults(document);
        } catch (Exception ex) {
            log.error("External API error: cannot search songs: Ultimate Guitar - {}", title);
            return Collections.emptyList();
        }
    }

}
