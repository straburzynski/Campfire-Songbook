package pl.straburzynski.campfiresongs.session.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import pl.straburzynski.campfiresongs.factory.SessionFactory;
import pl.straburzynski.campfiresongs.factory.SongFactory;
import pl.straburzynski.campfiresongs.session.model.Session;
import pl.straburzynski.campfiresongs.session.model.SessionDto;
import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;
import pl.straburzynski.campfiresongs.song.service.SongConverter;

import java.util.UUID;

public class SessionConverterTest {

    private final SongConverter songConverter = Mockito.mock(SongConverter.class);
    private final SessionConverter sessionConverter = new SessionConverter(songConverter);
    private final UUID id = UUID.randomUUID();
    private final String songData = SongFactory.createSongData(id);
    private final Song song = SongFactory.createSong(id);
    private final SongDto songDto = SongFactory.createSongDto(id);

    @Test
    public void convertFromSession_savedSong() {
        // given
        Session session = SessionFactory.createSession()
                .id(id)
                .song(song)
                .temporary(false)
                .build();
        SessionDto sessionDto = SessionFactory.createSessionDto()
                .id(id)
                .song(songDto)
                .temporary(false)
                .build();
        Mockito.when(songConverter.convertFromSong(song)).thenReturn(songDto);

        // when
        SessionDto convertedSessionDto = sessionConverter.convertFromSession(session);

        // then
        Mockito.verify(songConverter, Mockito.times(1)).convertFromSong(song);
        Assertions.assertEquals(convertedSessionDto.getId(), sessionDto.getId());
        Assertions.assertEquals(convertedSessionDto.getSong(), sessionDto.getSong());
        Assertions.assertEquals(convertedSessionDto.getName(), sessionDto.getName());
        Assertions.assertEquals(convertedSessionDto.getPassword(), sessionDto.getPassword());
    }

    @Test
    public void convertFromSession_temporarySong() {
        // given
        Session session = SessionFactory.createSession()
                .id(id)
                .songData(songData)
                .temporary(true)
                .build();

        SessionDto sessionDto = SessionFactory.createSessionDto()
                .id(id)
                .songData(songData)
                .song(songDto)
                .temporary(true)
                .build();
        Mockito.when(songConverter.parseFromSongData(songData)).thenReturn(songDto);

        // when
        SessionDto convertedSessionDto = sessionConverter.convertFromSession(session);

        // then
        Mockito.verify(songConverter, Mockito.times(1)).parseFromSongData(songData);
        Assertions.assertEquals(convertedSessionDto.getId(), sessionDto.getId());
        Assertions.assertEquals(convertedSessionDto.getSong(), sessionDto.getSong());
        Assertions.assertEquals(convertedSessionDto.getName(), sessionDto.getName());
        Assertions.assertEquals(convertedSessionDto.getPassword(), sessionDto.getPassword());
    }
}
