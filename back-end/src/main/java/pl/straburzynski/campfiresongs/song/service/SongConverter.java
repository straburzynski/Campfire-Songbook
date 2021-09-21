package pl.straburzynski.campfiresongs.song.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.song.exception.JsonParseException;
import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;

@Service
@RequiredArgsConstructor
public class SongConverter {

    private final ObjectMapper objectMapper;

    public String stringifyFromSongDto(SongDto songDto) {
        try {
            return objectMapper.writeValueAsString(songDto);
        } catch (JsonProcessingException e) {
            throw new JsonParseException("stringifyFromSongDto");
        }
    }

    public Song convertFromSongDto(SongDto songDto) {
        return objectMapper.convertValue(songDto, Song.class);
    }

    public SongDto parseFromSongData(String songData) {
        try {
            return objectMapper.readValue(songData, SongDto.class);
        } catch (JsonProcessingException e) {
            throw new JsonParseException("parseFromSongData");
        }
    }

    public SongDto convertFromSong(Song song) {
        return objectMapper.convertValue(song, SongDto.class);
    }
}
