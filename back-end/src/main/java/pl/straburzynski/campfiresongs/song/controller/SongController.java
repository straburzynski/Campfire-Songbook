package pl.straburzynski.campfiresongs.song.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;
import pl.straburzynski.campfiresongs.song.service.SongService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public List<Song> findAll() {
        return songService.findAll();
    }

    @PostMapping
    public void create(@RequestBody SongDto songDto) {
        songService.create(songDto);
    }

    @PutMapping("{id}")
    public void update(@PathVariable UUID id, @RequestBody SongDto songDto) {
        songService.update(id, songDto);
    }

    @GetMapping("{id}")
    public Song findById(@PathVariable UUID id) {
        return songService.findById(id);
    }

    @DeleteMapping("{id}")
    public void deleteById(@PathVariable UUID id) {
        songService.deleteById(id);
    }
}
