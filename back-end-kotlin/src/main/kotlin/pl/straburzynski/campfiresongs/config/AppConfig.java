package pl.straburzynski.campfiresongs.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${app.externalApiUrl.spiewnikWywrota}")
    private String externalApiUrlSpiewnikWywrota;

    @Value("${app.externalApiUrl.ultimateGuitar}")
    private String externalApiUrlUltimateGuitar;

}
