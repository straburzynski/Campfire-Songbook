package pl.straburzynski.campfiresongs.config;


import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class AppConfig {

    @Value("${app.externalApiUrl}")
    private String externalApiUrl;

}
