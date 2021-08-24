package pl.straburzynski.campfiresongs.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.exception.SessionNotFoundException;
import pl.straburzynski.campfiresongs.model.Session;
import pl.straburzynski.campfiresongs.service.SessionService;

import java.util.UUID;

@RestController
@RequestMapping(value = "sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("{name}")
    public Session findByName(@PathVariable String name) {
        return sessionService.findBySessionName(name).orElseThrow(() -> new SessionNotFoundException(name));
    }

    @PostMapping
    public Session createSession(@RequestBody Session session) {
        return sessionService.createSession(session.getName());
    }

    @PutMapping
    public Session updateSession(@RequestBody Session session) {
        return sessionService.updateSession(session);
    }

    @DeleteMapping("{id}")
    public void deleteSession(@PathVariable UUID id) {
        sessionService.deleteSession(id);
    }
}
