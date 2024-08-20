package pl.straburzynski.campfiresongs.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration

@Configuration
class AppConfig {
    @Value("\${app.externalApiUrl.spiewnikWywrota}")
    lateinit var externalApiUrlSpiewnikWywrota: String

    @Value("\${app.externalApiUrl.ultimateGuitar}")
    lateinit var externalApiUrlUltimateGuitar: String

}