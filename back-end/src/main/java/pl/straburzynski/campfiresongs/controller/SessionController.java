package pl.straburzynski.campfiresongs.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.model.SessionDto;
import pl.straburzynski.campfiresongs.service.SessionService;

import java.util.UUID;

@RestController
@RequestMapping(value = "sessions")
@CrossOrigin("*")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("{name}")
    public SessionDto findByName(@PathVariable String name) {
        return sessionService.findBySessionName(name);
    }

    @PostMapping
    public SessionDto createSession(@RequestBody SessionDto sessionDto) {
        return sessionService.createSession(sessionDto.getName());
    }

    @PutMapping
    public SessionDto updateSession(@RequestBody SessionDto sessionDto) {
        return sessionService.updateSession(sessionDto);
    }

    @DeleteMapping("{id}")
    public void deleteSession(@PathVariable UUID id) {
        sessionService.deleteSession(id);
    }
}
