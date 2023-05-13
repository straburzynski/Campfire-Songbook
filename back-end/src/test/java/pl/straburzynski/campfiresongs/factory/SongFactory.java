package pl.straburzynski.campfiresongs.factory;

import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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

    public static List<SongDto> createSongDtoList(Integer songsNumber) {
        return IntStream.range(0, songsNumber)
                .mapToObj(i -> createSongDto(UUID.randomUUID()))
                .collect(Collectors.toList());
    }

    public static String createSongData(UUID id) {
        return "{\"id\":" + id + ",\"author\":\"author\",\"title\":\"title\",\"lyrics\":\"lyrics\"}";
    }
}
