package pl.straburzynski.campfiresongs.externalapi.controller;

import lombok.RequiredArgsConstructor;
import org.jsoup.nodes.Document;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;
import pl.straburzynski.campfiresongs.externalapi.service.RestService;
import pl.straburzynski.campfiresongs.externalapi.service.SongScrapperService;
import pl.straburzynski.campfiresongs.externalapi.service.parser.ParserService;
import pl.straburzynski.campfiresongs.externalapi.service.parser.SpiewnikWywrotaParserService;
import pl.straburzynski.campfiresongs.externalapi.service.parser.UltimateGuitarParserService;
import pl.straburzynski.campfiresongs.session.model.SessionDto;
import pl.straburzynski.campfiresongs.session.service.SessionService;
import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;

import java.util.List;
import java.util.UUID;

import static pl.straburzynski.campfiresongs.externalapi.service.parser.ParserService.parseSongFromDocument;

@RestController
@RequestMapping(value = "external")
@RequiredArgsConstructor
public class ExternalApiController {

    private final RestService restService;
    private final SongScrapperService scrapper;
    private final SessionService sessionService;

    @GetMapping("/search")
    public List<ExternalApiSong> searchByTitle(@RequestParam("title") String title) {
        return restService.searchByTitle(title);
    }

    @PostMapping("/parse")
    public Song parseSongFromUrl(@RequestBody ExternalApiSong externalApiSong) {
        Document document = scrapper.getDocumentByUrl(externalApiSong.getUrl());
        String lyrics = parseSongFromDocument(externalApiSong, document);
        return Song.builder()
                .id(UUID.randomUUID())
                .lyrics(lyrics)
                .title(externalApiSong.getTitle())
                .author(externalApiSong.getArtist())
                .build();
    }

    @PostMapping("/updateSession")
    public SessionDto updateSession(@RequestBody ExternalApiSong externalApiSong,
                                    @RequestParam("sessionName") String sessionName) {
        Document document = scrapper.getDocumentByUrl(externalApiSong.getUrl());
        String lyrics = parseSongFromDocument(externalApiSong, document);
        SessionDto sessionDto = SessionDto.builder()
                .name(sessionName)
                .temporary(true)
                .song(SongDto.builder()
                        .lyrics(lyrics)
                        .title(externalApiSong.getTitle())
                        .author(externalApiSong.getArtist())
                        .build())
                .build();
        return sessionService.updateSession(sessionDto);
    }

}
