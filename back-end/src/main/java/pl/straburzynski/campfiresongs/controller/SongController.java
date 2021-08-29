package pl.straburzynski.campfiresongs.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.model.Song;
import pl.straburzynski.campfiresongs.service.ExternalApiSongService;
import pl.straburzynski.campfiresongs.service.SongService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "songs")
public class SongController {

    private final SongService songService;
    private final ExternalApiSongService externalApiSongService;

    public SongController(SongService songService, ExternalApiSongService externalApiSongService) {
        this.songService = songService;
        this.externalApiSongService = externalApiSongService;
    }

    @GetMapping
    public List<Song> findAll() {
        return songService.findAll();
    }

    @GetMapping("{id}")
    public Song findById(@PathVariable String id) {
        return songService.findById(UUID.fromString(id));
    }

    @GetMapping("/search")
    public List<Song> searchByTitle(@RequestParam("title") String title) {
        return externalApiSongService.searchByTitle(title);
    }

}
