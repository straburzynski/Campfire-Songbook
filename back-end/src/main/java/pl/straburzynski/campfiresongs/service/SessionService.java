package pl.straburzynski.campfiresongs.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.exception.SessionNotFoundException;
import pl.straburzynski.campfiresongs.model.Session;
import pl.straburzynski.campfiresongs.repository.SessionRepository;

import java.util.UUID;

@Service
@Slf4j
public class SessionService {

    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public Session findByName(String name) {
        return sessionRepository.findByName(name).orElseThrow(() -> new SessionNotFoundException(name));
    }

    public Session createSession(Session newSession) {
        Session createdSession = sessionRepository.save(Session.builder()
                .id(UUID.randomUUID())
                .songId(newSession.getSongId())
                .name(newSession.getName())
                .password(newSession.getPassword())
                .build());
        log.debug("Session created, id: {}, name: {}", createdSession.getId(), createdSession.getName());
        return createdSession;
    }

    public void deleteSession(UUID id) {
        Session foundSession = sessionRepository.findById(id).orElseThrow(() -> new SessionNotFoundException(id.toString()));
        log.debug("Deleting session, id: {}, name: {}", foundSession.getId(), foundSession.getName());
        sessionRepository.deleteById(id);
    }

}
