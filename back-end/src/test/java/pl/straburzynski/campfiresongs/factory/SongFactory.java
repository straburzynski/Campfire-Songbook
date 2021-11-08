package pl.straburzynski.campfiresongs.factory;

import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;

import java.util.UUID;

public class SongFactory {

    public static Song createSong(UUID id) {
        return Song.builder()
                .id(id)
                .author("author")
                .title("title")
                .lyrics("lyrics")
                .build();
    }

    public static SongDto createSongDto(UUID id) {
        return SongDto.builder()
                .id(id)
                .author("author")
                .title("title")
                .lyrics("lyrics")
                .build();
    }

    public static String createSongData(UUID id) {
        return "{\"id\":" + id + ",\"author\":\"author\",\"title\":\"title\",\"lyrics\":\"lyrics\"}";
    }
}
