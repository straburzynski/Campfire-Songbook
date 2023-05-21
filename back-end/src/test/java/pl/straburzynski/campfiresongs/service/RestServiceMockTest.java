package pl.straburzynski.campfiresongs.service;

import org.jsoup.nodes.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestTemplate;
import pl.straburzynski.campfiresongs.config.AppConfig;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiResponse;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;
import pl.straburzynski.campfiresongs.externalapi.service.RestService;
import pl.straburzynski.campfiresongs.externalapi.service.SongScrapperService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class RestServiceMockTest {

    private final String ultimateGuitarUrl = "https://ultimate-guitar.com/";
    private final String spiewnikWywrotaUrl = "https://spiewnik-wywrota.com/";
    private final String songTitle = "test";
    private AppConfig appConfig;
    private RestTemplate restTemplate;
    private RestService restService;
    private SongScrapperService scrapper;

    @BeforeEach
    public void setUp() {
        appConfig = Mockito.mock(AppConfig.class);
        restTemplate = Mockito.mock(RestTemplate.class);
        scrapper = Mockito.mock(SongScrapperService.class);
    }

    @Test
    public void should_return_externalApiResponse_mockApi() {
        // given
        ExternalApiResponse externalApiResponse = ExternalApiResponse.builder()
                .songs(new ArrayList<>())
                .artists(new ArrayList<>())
                .build();
        restService = new RestService(appConfig, restTemplate, scrapper);
        Mockito.when(appConfig.getExternalApiUrlSpiewnikWywrota()).thenReturn(spiewnikWywrotaUrl);
        Mockito.when(appConfig.getExternalApiUrlUltimateGuitar()).thenReturn(ultimateGuitarUrl);
        Mockito.when(scrapper.getDocumentByUrl(ultimateGuitarUrl + songTitle)).thenReturn(new Document(ultimateGuitarUrl));
        Mockito.when(restTemplate.getForObject(Mockito.any(String.class), Mockito.eq(ExternalApiResponse.class))).thenReturn(externalApiResponse);

        // when
        List<ExternalApiSong> response = restService.searchByTitle(songTitle);

        // then
        assertNotNull(response);
    }
}
