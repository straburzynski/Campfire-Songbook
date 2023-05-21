package pl.straburzynski.campfiresongs.service;

import org.jsoup.nodes.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestTemplate;
import pl.straburzynski.campfiresongs.config.AppConfig;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;
import pl.straburzynski.campfiresongs.externalapi.service.RestService;
import pl.straburzynski.campfiresongs.externalapi.service.SongScrapperService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class RestServiceRealApiTest {

    private final String ultimateGuitarUrl = "https://www.ultimate-guitar.com/search.php?type=300&title=";
    private final String spiewnikWywrotaUrl = "https://api.wywrota.pl/api/suggest?q=";
    private final String songTitle = "test";
    private AppConfig appConfig;
    private RestService restService;
    private SongScrapperService scrapper;

    @BeforeEach
    public void setUp() {
        appConfig = Mockito.mock(AppConfig.class);
        scrapper = Mockito.mock(SongScrapperService.class);
    }

    @Test
    public void should_Return_ExternalApiResponse_SpiewnikWywrota_RealApi() {
        // given
        restService = new RestService(appConfig, new RestTemplate(), scrapper);
        Mockito.when(appConfig.getExternalApiUrlSpiewnikWywrota()).thenReturn(spiewnikWywrotaUrl);
        Mockito.when(scrapper.getDocumentByUrl(ultimateGuitarUrl + songTitle)).thenReturn(new Document(ultimateGuitarUrl));

        // when
        List<ExternalApiSong> response = restService.searchByTitle(songTitle);

        // then
        assertNotNull(response);
    }

    @Test
    public void should_Return_ExternalApiResponse_UltimateGuitar_RealApi() {
        // given
        restService = new RestService(appConfig, new RestTemplate(), new SongScrapperService());
        Mockito.when(appConfig.getExternalApiUrlUltimateGuitar()).thenReturn(ultimateGuitarUrl);

        // when
        List<ExternalApiSong> response = restService.searchByTitle(songTitle);

        // then
        assertNotNull(response);
    }
}
