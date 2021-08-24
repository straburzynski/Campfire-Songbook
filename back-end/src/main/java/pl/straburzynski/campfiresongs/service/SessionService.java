package pl.straburzynski.campfiresongs.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.exception.SessionNotFoundException;
import pl.straburzynski.campfiresongs.model.Session;
import pl.straburzynski.campfiresongs.repository.SessionRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SimpMessagingTemplate template;

    public SessionService(SessionRepository sessionRepository,
                          SimpMessagingTemplate template) {
        this.sessionRepository = sessionRepository;
        this.template = template;
    }

    public Optional<Session> findBySessionName(String sessionName) {
        return sessionRepository.findByName(sessionName);
    }

    public Session createSession(String sessionName) {
        Session foundSession = findBySessionName(sessionName)
                .orElseGet(() -> sessionRepository.save(
                        Session.builder()
                                .id(UUID.randomUUID())
                                .songId(null)
                                .name(sessionName)
                                // todo password handling
                                .password(null)
                                .build()
                        )
                );
        log.debug("Create session, id: {}, name: {}", foundSession.getId(), foundSession.getName());
        return foundSession;
    }

    public Session updateSession(Session session) {
        Session foundSession = sessionRepository.findByName(session.getName())
                .orElseThrow(() -> new SessionNotFoundException(session.getName()));
        foundSession.setSongId(session.getSongId());
        Session updatedSession = sessionRepository.save(foundSession);
        log.debug("Update session, name: {}, songId: {}", updatedSession.getName(), updatedSession.getSongId());

        template.convertAndSend("/topic/message", updatedSession.getSongId());
        return updatedSession;
    }

    public void deleteSession(UUID id) {
        Session foundSession = sessionRepository.findById(id).orElseThrow(() -> new SessionNotFoundException(id.toString()));
        log.debug("Deleting session, id: {}, name: {}", foundSession.getId(), foundSession.getName());
        sessionRepository.deleteById(id);
    }

}
