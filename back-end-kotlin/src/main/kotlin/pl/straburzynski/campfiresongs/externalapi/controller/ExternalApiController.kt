package pl.straburzynski.campfiresongs.externalapi.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong
import pl.straburzynski.campfiresongs.externalapi.service.RestService
import pl.straburzynski.campfiresongs.externalapi.service.SongScrapperService
import pl.straburzynski.campfiresongs.externalapi.service.parser.ParseService.parseSongFromDocument
import pl.straburzynski.campfiresongs.session.model.SessionDto
import pl.straburzynski.campfiresongs.session.service.SessionService
import pl.straburzynski.campfiresongs.song.model.SongDto
import java.util.UUID.randomUUID


@RestController
@RequestMapping(value = ["external"])
class ExternalApiController(
    val restService: RestService,
    val scrapper: SongScrapperService,
    val sessionService: SessionService,
) {
    @GetMapping("/search")
    fun searchByTitle(@RequestParam("title") title: String): List<ExternalApiSong> =
        restService.searchByTitle(title)

    @PostMapping("/parse")
    fun parseSongFromUrl(@RequestBody externalApiSong: ExternalApiSong): SongDto {
        val document = scrapper.getDocumentByUrl(externalApiSong.url)
        val lyrics = parseSongFromDocument(externalApiSong, document)
        return SongDto(
            randomUUID(),
            externalApiSong.artist,
            externalApiSong.title,
            lyrics,
        )
    }

    @PostMapping("/updateSession")
    fun updateSession(
        @RequestBody externalApiSong: ExternalApiSong,
        @RequestParam("sessionName") sessionName: String
    ): SessionDto {
        val document = scrapper.getDocumentByUrl(externalApiSong.url)
        val lyrics: String = parseSongFromDocument(externalApiSong, document)
        val sessionDto = SessionDto(
            randomUUID(),
            song = SongDto(
                randomUUID(),
                externalApiSong.artist,
                externalApiSong.title,
                lyrics,
            ),
            sessionName,
            null,
            true,
            null
        )
        return sessionService.updateSession(sessionDto)
    }
}