package pl.straburzynski.campfiresongs.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestTemplate;
import pl.straburzynski.campfiresongs.config.AppConfig;
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiResponse;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;
import pl.straburzynski.campfiresongs.externalapi.service.RestService;
import pl.straburzynski.campfiresongs.externalapi.service.SongScrapperService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class RestServiceTest {

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
        Mockito.when(appConfig.getExternalApiUrlSpiewnikWywrota()).thenReturn("https://api.com/");
        Mockito.when(restTemplate.getForObject(Mockito.any(String.class), Mockito.eq(ExternalApiResponse.class))).thenReturn(externalApiResponse);

        // when
        List<ExternalApiSong> response = restService.searchByTitle("test");

        // then
        assertNotNull(response);
    }

    @Test
    public void should_throw_externalApiException_mockApi() {
        Assertions.assertThrows(ExternalApiException.class, () -> {
            // given
            restService = new RestService(appConfig, restTemplate, scrapper);
            Mockito.when(appConfig.getExternalApiUrlSpiewnikWywrota()).thenReturn("https://api.com/");
            Mockito.when(restTemplate.getForObject(Mockito.any(String.class), Mockito.eq(ExternalApiResponse.class))).thenThrow(new ExternalApiException("TestCase"));

            // when
            restService.searchByTitle("test");
        });
    }

    @Test
    public void should_Return_ExternalApiResponse_RealApi() {
        // given
        restService = new RestService(appConfig, new RestTemplate(), scrapper);
        Mockito.when(appConfig.getExternalApiUrlSpiewnikWywrota()).thenReturn("https://api.wywrota.pl/api/suggest?q=");

        // when
        List<ExternalApiSong> response = restService.searchByTitle("test");

        // then
        assertNotNull(response);
    }
}
