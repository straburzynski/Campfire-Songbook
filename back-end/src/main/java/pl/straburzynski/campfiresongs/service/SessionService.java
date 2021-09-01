package pl.straburzynski.campfiresongs.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.exception.SessionNotFoundException;
import pl.straburzynski.campfiresongs.model.Session;
import pl.straburzynski.campfiresongs.model.SessionDto;
import pl.straburzynski.campfiresongs.repository.SessionRepository;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SimpMessagingTemplate template;
    private final SongConverter songConverter;
    private final SessionConverter sessionConverter;

    public SessionDto findBySessionName(String sessionName) {
        Session session = sessionRepository.findByName(sessionName)
                .orElseThrow(() -> new SessionNotFoundException(sessionName));
        return sessionConverter.convertFromSession(session);
    }

    public SessionDto createSession(String sessionName) {
        // todo password handling if session exists
        Session foundSession = sessionRepository.findByName(sessionName)
                .orElseGet(() -> sessionRepository.save(
                        Session.builder()
                                .id(UUID.randomUUID())
                                .name(sessionName)
                                .build()
                        )
                );
        log.debug("Create session, id: {}, name: {}", foundSession.getId(), foundSession.getName());
        return sessionConverter.convertFromSession(foundSession);
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
        log.debug("Update session, name: {}, songId: {}", updatedSession.getName(), updatedSession.getSong().getId());

        template.convertAndSend("/topic/message/" + updatedSession.getName(), updatedSession.getSong());
        return sessionConverter.convertFromSession(updatedSession);
    }

    public void deleteSession(UUID id) {
        Session foundSession = sessionRepository.findById(id).orElseThrow(() -> new SessionNotFoundException(id.toString()));
        log.debug("Deleting session, id: {}, name: {}", foundSession.getId(), foundSession.getName());
        sessionRepository.deleteById(id);
    }

}
