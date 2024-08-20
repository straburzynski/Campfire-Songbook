package pl.straburzynski.campfiresongs

import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.client.WireMock.configureFor
import com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import io.kotest.common.runBlocking
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.web.reactive.server.WebTestClient
import pl.straburzynski.campfiresongs.session.repository.SessionRepository
import pl.straburzynski.campfiresongs.song.repository.SongRepository
import java.util.logging.Logger


@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureWebTestClient
class BaseIntegrationTest {

    @LocalServerPort
    protected var port = 0

    @Autowired
    lateinit var client: WebTestClient

    @Autowired
    lateinit var songRepository: SongRepository

    @Autowired
    lateinit var sessionRepository: SessionRepository

    val wiremock = WireMockServer(wireMockConfig().port(8099))

    @BeforeEach
    fun prepare() {
        runBlocking { sessionRepository.deleteAll() }
        runBlocking { songRepository.deleteAll() }
        wiremock.start()
        configureFor("localhost", wiremock.port())
    }

    @AfterEach
    fun cleanUp() {
        wiremock.resetAll()
        wiremock.stop()
    }

    companion object {
        val logger: Logger = Logger.getLogger(this::class.java.name)
    }
}
