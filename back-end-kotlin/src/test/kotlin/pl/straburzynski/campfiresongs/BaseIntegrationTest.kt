package pl.straburzynski.campfiresongs

import io.kotest.common.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.reactive.server.WebTestClient
import pl.straburzynski.campfiresongs.song.repository.SongRepository
import java.util.logging.Logger


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class BaseIntegrationTest {

    @Autowired
    lateinit var client: WebTestClient

    @Autowired
    lateinit var songRepository: SongRepository

    @BeforeEach
    fun cleanUp() {
        runBlocking { songRepository.deleteAll() }
    }

    companion object {
        val logger: Logger = Logger.getLogger(this::class.java.name)
    }
}
