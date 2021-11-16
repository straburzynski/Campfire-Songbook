package pl.straburzynski.campfiresongs.session.service;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.straburzynski.campfiresongs.factory.SessionFactory;
import pl.straburzynski.campfiresongs.factory.SongFactory;
import pl.straburzynski.campfiresongs.session.exception.SessionNotFoundException;
import pl.straburzynski.campfiresongs.session.model.Session;
import pl.straburzynski.campfiresongs.session.model.SessionDto;
import pl.straburzynski.campfiresongs.session.repository.SessionRepository;
import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;
import pl.straburzynski.campfiresongs.song.service.SongConverter;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    SessionRepository sessionRepository;

    @Mock
    SimpMessagingTemplate simpMessagingTemplate;

    @Mock
    SongConverter songConverter;

    @Mock
    SessionConverter sessionConverter;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    SessionService sessionService;

    @Test
    void findBySessionName_returnsSessionDto() {
        // given
        Session session = SessionFactory.createSession().build();
        SessionDto sessionDto = SessionFactory.createSessionDto().build();
        Mockito.when(sessionRepository.findByName("name")).thenReturn(Optional.of(session));
        Mockito.when(sessionConverter.convertFromSession(session)).thenReturn(sessionDto);

        // when
        SessionDto foundSessionDto = sessionService.findBySessionName("name");

        // then
        Assertions.assertThat(foundSessionDto).isNotNull();
        Assertions.assertThat(sessionDto.getName()).isEqualTo("name");
    }

    @Test
    void findBySessionName_throwsException() {
        // given
        Mockito.doThrow(SessionNotFoundException.class).when(sessionRepository).findByName("name");

        // when
        // then
        Assertions.assertThatThrownBy(
                () -> sessionService.findBySessionName("name")
        ).isInstanceOf(SessionNotFoundException.class);
    }

    @Test
    void createSession_createNewSession() {
        // given
        Session session = SessionFactory.createSession().build();
        SessionDto sessionDto = SessionFactory.createSessionDto().build();

        Mockito.when(sessionRepository.findByName("name")).thenReturn(Optional.empty());
        Mockito.when(sessionRepository.save(any(Session.class))).thenReturn(session);
        Mockito.when(sessionConverter.convertFromSession(session)).thenReturn(sessionDto);

        // when
        SessionDto createdSession = sessionService.createSession(sessionDto);

        // then
        Assertions.assertThat(createdSession).isNotNull();
        Assertions.assertThat(createdSession).isEqualTo(sessionDto);
        Mockito.verify(sessionRepository, Mockito.times(1)).findByName("name");
        Mockito.verify(sessionRepository, Mockito.times(1)).save(any(Session.class));
        Mockito.verify(sessionConverter, Mockito.times(1)).convertFromSession(session);
    }

    @Test
    void updateSession_throwsException() {
        // given
        UUID id = UUID.randomUUID();
        SessionDto sessionDto = SessionFactory.createSessionDto().id(id).build();

        // when
        // then
        Assertions.assertThatThrownBy(
                () -> sessionService.updateSession(sessionDto)
        ).isInstanceOf(SessionNotFoundException.class);
    }

    @Test
    void updateSession_returnsUpdatedSession() {
        // given
        UUID id = UUID.randomUUID();
        SongDto songDto = SongFactory.createSongDto(id);
        Song song = SongFactory.createSong(id);
        SessionDto sessionDto = SessionFactory.createSessionDto().song(songDto).build();
        Session session = SessionFactory.createSession().song(song).build();
        Mockito.when(sessionRepository.findByName("name")).thenReturn(Optional.of(session));
        Mockito.when(songConverter.convertFromSongDto(songDto)).thenReturn(song);
        Mockito.when(sessionRepository.save(any(Session.class))).thenReturn(session);
        Mockito.when(sessionConverter.convertFromSession(any(Session.class))).thenReturn(sessionDto);

        // when
        SessionDto updatedSessionDto = sessionService.updateSession(sessionDto);

        // then
        Assertions.assertThat(updatedSessionDto).isNotNull();
        Assertions.assertThat(updatedSessionDto.getSong()).isEqualTo(songDto);
        Mockito.verify(sessionRepository, Mockito.times(1)).findByName("name");
        Mockito.verify(sessionRepository, Mockito.times(1)).save(any(Session.class));
        Mockito.verify(songConverter, Mockito.times(1)).convertFromSongDto(songDto);
        Mockito.verify(sessionConverter, Mockito.times(1)).convertFromSession(session);
    }

    @Test
    void deleteSession_deletesSuccessfully() {
        // given
        UUID id = UUID.randomUUID();
        Session session = SessionFactory.createSession().id(id).build();
        Mockito.when(sessionRepository.findById(id)).thenReturn(Optional.of(session));

        // when
        sessionService.deleteSession(id);

        // then
        Mockito.verify(sessionRepository, Mockito.times(1)).deleteById(id);
    }

    @Test
    void deleteSession_throwsException() {
        // given
        UUID id = UUID.randomUUID();

        // when
        // then
        Assertions.assertThatThrownBy(
                () -> sessionService.deleteSession(id)
        ).isInstanceOf(SessionNotFoundException.class);
    }
}
