package pl.straburzynski.campfiresongs.song.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import pl.straburzynski.campfiresongs.factory.SongFactory;
import pl.straburzynski.campfiresongs.song.exception.JsonParseException;
import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;

import java.util.UUID;

public class SongConverterTest {

    private final ObjectMapper objectMapper = Mockito.mock(ObjectMapper.class);
    private final UUID id = UUID.randomUUID();
    private final String songData = SongFactory.createSongData(id);
    private final SongConverter songConverter = new SongConverter(objectMapper);
    private final Song song = SongFactory.createSong(id);
    private final SongDto songDto = SongFactory.createSongDto(id);

    @Test
    public void stringifyFromSongDto() {
        // when
        String songData = songConverter.stringifyFromSongDto(songDto);

        // then
        Assertions.assertThat(songData).isEqualTo(songData);
    }

    @Test
    public void parseFromSongData() throws JsonProcessingException {
        // given
        Mockito.when(objectMapper.readValue(songData, SongDto.class)).thenReturn(songDto);

        // when
        SongDto convertedSongDto = songConverter.parseFromSongData(songData);

        //then
        Assertions.assertThat(convertedSongDto).isEqualTo(songDto);
    }

    @Test
    public void parseFromSongData_throwsException() throws JsonProcessingException {
        // given
        Mockito.doThrow(JsonProcessingException.class).when(objectMapper).readValue("invalidJson", SongDto.class);

        // when
        // then
        Assertions.assertThatThrownBy(
                () -> songConverter.parseFromSongData("invalidJson")
        ).isInstanceOf(JsonParseException.class);
    }

    @Test
    public void convertFromSong() {
        // given
        Mockito.when(objectMapper.convertValue(song, SongDto.class)).thenReturn(songDto);

        // when
        SongDto convertedSongDto = songConverter.convertFromSong(song);

        //then
        Assertions.assertThat(convertedSongDto).isEqualTo(songDto);
    }
}
