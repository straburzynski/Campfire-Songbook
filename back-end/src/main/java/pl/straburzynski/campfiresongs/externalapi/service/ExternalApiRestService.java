package pl.straburzynski.campfiresongs.externalapi.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pl.straburzynski.campfiresongs.config.AppConfig;
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiResponse;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;

import java.util.Collections;
import java.util.List;

@Service
public class ExternalApiRestService {

    private final RestTemplate restTemplate;
    private final AppConfig appConfig;

    public ExternalApiRestService(AppConfig appConfig, RestTemplate restTemplate) {
        this.appConfig = appConfig;
        this.restTemplate = restTemplate;
    }

    public List<ExternalApiSong> searchByTitle(String title) {
        String url = appConfig.getExternalApiUrl() + title;
        try {
            ExternalApiResponse response = restTemplate.getForObject(url, ExternalApiResponse.class);
            if (response != null) {
                if (response.getSongs() != null) {
                    return response.getSongs();
                }
            }
            return Collections.emptyList();
        } catch (Exception ex) {
            throw new ExternalApiException("searchByTitle");
        }
    }

}
