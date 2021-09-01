package pl.straburzynski.campfiresongs.externalapi.controller;

import org.jsoup.nodes.Document;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong;
import pl.straburzynski.campfiresongs.externalapi.service.ExternalApiParserService;
import pl.straburzynski.campfiresongs.externalapi.service.ExternalApiRestService;
import pl.straburzynski.campfiresongs.externalapi.service.ExternalApiSongScrapperService;
import pl.straburzynski.campfiresongs.model.Song;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "external")
public class ExternalApiController {

    private final ExternalApiRestService externalApiRestService;
    private final ExternalApiSongScrapperService scrapper;

    public ExternalApiController(ExternalApiRestService externalApiRestService,
                                 ExternalApiSongScrapperService scrapper) {
        this.externalApiRestService = externalApiRestService;
        this.scrapper = scrapper;
    }

    @GetMapping("/search")
    public List<ExternalApiSong> searchByTitle(@RequestParam("title") String title) {
        return externalApiRestService.searchByTitle(title);
    }

    @PostMapping("/parse")
    public Song parseSongFromUrl(@RequestBody ExternalApiSong externalApiSong) {
        Document document = scrapper.getDocumentByUrl(externalApiSong.getUrl());
        String lyrics = ExternalApiParserService.parseLyricsFromDocument(document);
        Song song = Song.builder()
                .id(UUID.randomUUID())
                .lyrics(lyrics)
                .title(externalApiSong.getTitle())
                .author(externalApiSong.getArtist())
                .build();
        return song;
    }


}
