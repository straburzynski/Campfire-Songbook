package pl.straburzynski.campfiresongs.session.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.session.exception.NotAuthorizedException;
import pl.straburzynski.campfiresongs.session.model.Session;
import pl.straburzynski.campfiresongs.session.model.SessionDto;
import pl.straburzynski.campfiresongs.session.repository.SessionRepository;
import pl.straburzynski.campfiresongs.session.exception.SessionNotFoundException;
import pl.straburzynski.campfiresongs.song.service.SongConverter;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SimpMessagingTemplate template;
    private final SongConverter songConverter;
    private final SessionConverter sessionConverter;
    private final PasswordEncoder passwordEncoder;

    public SessionDto findBySessionName(String sessionName) {
        Session session = sessionRepository.findByName(sessionName)
                .orElseThrow(() -> new SessionNotFoundException(sessionName));
        return sessionConverter.convertFromSession(session);
    }

    public SessionDto createSession(SessionDto sessionDto) {
        Session session;
        Optional<Session> foundSession = sessionRepository.findByName(sessionDto.getName());
        if (foundSession.isPresent()) {
            checkPassword(sessionDto, foundSession.get());
            session = foundSession.get();
        } else {
            session = sessionRepository.save(
                    Session.builder()
                            .id(UUID.randomUUID())
                            .name(sessionDto.getName())
                            .password(passwordEncoder.encode(sessionDto.getPassword()))
                            .build()
            );
        }
        log.debug("Create session, id: {}, name: {}", session.getId(), session.getName());
        return sessionConverter.convertFromSession(session);
    }

    private void checkPassword(SessionDto sessionDto, Session session) {
        if (Objects.isNull(sessionDto.getPassword()) || !passwordEncoder.matches(sessionDto.getPassword(), session.getPassword())) {
            throw new NotAuthorizedException();
        }
    }

    public SessionDto updateSession(SessionDto sessionDto) {
        Session foundSession = sessionRepository.findByName(sessionDto.getName())
                .orElseThrow(() -> new SessionNotFoundException(sessionDto.getName()));
        foundSession.setTemporary(sessionDto.isTemporary());
        if (sessionDto.isTemporary()) {
            foundSession.setSong(null);
            foundSession.setSongData(songConverter.stringifyFromSongDto(sessionDto.getSong()));
        } else {
            foundSession.setSong(songConverter.convertFromSongDto(sessionDto.getSong()));
            foundSession.setSongData(null);
        }
        Session updatedSession = sessionRepository.save(foundSession);
        log.debug("Update session, name: {}, temporary: {}, songId: {}",
                updatedSession.getName(), updatedSession.isTemporary(),
                updatedSession.isTemporary() ? "---" : updatedSession.getSong().getId());

        template.convertAndSend("/topic/message/" + updatedSession.getName(), sessionDto.getSong());
        return sessionConverter.convertFromSession(updatedSession);
    }

    public void deleteSession(UUID id) {
        Session foundSession = sessionRepository.findById(id).orElseThrow(() -> new SessionNotFoundException(id.toString()));
        log.debug("Deleting session, id: {}, name: {}", foundSession.getId(), foundSession.getName());
        sessionRepository.deleteById(id);
    }

}
