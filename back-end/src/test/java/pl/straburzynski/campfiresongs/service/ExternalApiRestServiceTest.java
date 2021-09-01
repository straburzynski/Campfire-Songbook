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
import pl.straburzynski.campfiresongs.externalapi.service.ExternalApiRestService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ExternalApiRestServiceTest {

    private AppConfig appConfig;
    private RestTemplate restTemplate;
    private ExternalApiRestService externalApiRestService;

    @BeforeEach
    public void setUp() {
        appConfig = Mockito.mock(AppConfig.class);
        restTemplate = Mockito.mock(RestTemplate.class);
    }

    @Test
    public void should_return_externalApiResponse_mockApi() {
        // given
        ExternalApiResponse externalApiResponse = ExternalApiResponse.builder()
                .songs(new ArrayList<>())
                .artists(new ArrayList<>())
                .build();
        externalApiRestService = new ExternalApiRestService(appConfig, restTemplate);
        Mockito.when(appConfig.getExternalApiUrl()).thenReturn("https://api.com/");
        Mockito.when(restTemplate.getForObject(Mockito.any(String.class), Mockito.eq(ExternalApiResponse.class))).thenReturn(externalApiResponse);

        // when
        List<ExternalApiSong> response = externalApiRestService.searchByTitle("test");

        // then
        assertNotNull(response);
    }

    @Test
    public void should_throw_externalApiException_mockApi() {
        Assertions.assertThrows(ExternalApiException.class, () -> {
            // given
            externalApiRestService = new ExternalApiRestService(appConfig, restTemplate);
            Mockito.when(appConfig.getExternalApiUrl()).thenReturn("https://api.com/");
            Mockito.when(restTemplate.getForObject(Mockito.any(String.class), Mockito.eq(ExternalApiResponse.class))).thenThrow(new ExternalApiException("TestCase"));

            // when
            externalApiRestService.searchByTitle("test");
        });
    }

    @Test
    public void should_Return_ExternalApiResponse_RealApi() {
        // given
        externalApiRestService = new ExternalApiRestService(appConfig, new RestTemplate());
        Mockito.when(appConfig.getExternalApiUrl()).thenReturn("https://api.wywrota.pl/api/suggest?q=");

        // when
        List<ExternalApiSong> response = externalApiRestService.searchByTitle("test");

        // then
        assertNotNull(response);
    }
}
