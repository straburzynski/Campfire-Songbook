package pl.straburzynski.campfiresongs.song.controller;

import com.google.common.collect.ImmutableMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.exception.CustomException;
import pl.straburzynski.campfiresongs.exception.ErrorResponse;
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

    @GetMapping("{id}")
    public Song findById(@PathVariable String id) {
        return songService.findById(UUID.fromString(id));
    }

    @GetMapping("test")
    public void test() {
        throw new CustomException(ErrorResponse.builder()
                .translationKey("code").message("message")
                .params(ImmutableMap.of("i18n", "exception.custom_message"))
                .build());
    }
}
