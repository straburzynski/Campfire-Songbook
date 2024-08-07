package pl.straburzynski.campfiresongs.session.controller

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.straburzynski.campfiresongs.session.model.SessionDto
import pl.straburzynski.campfiresongs.session.service.SessionService
import java.util.UUID


@RestController
@RequestMapping(value = ["sessions"])
@CrossOrigin("*")
class SessionController(val sessionService: SessionService) {

    @GetMapping("{name}")
    fun findByName(@PathVariable name: String): SessionDto = sessionService.findBySessionName(name)

    @PostMapping
    fun createSession(@RequestBody sessionDto: SessionDto): SessionDto = sessionService.createSession(sessionDto)

    @PutMapping
    fun updateSession(@RequestBody sessionDto: SessionDto): SessionDto = sessionService.updateSession(sessionDto)

    @DeleteMapping("{id}")
    fun deleteSession(@PathVariable id: UUID) = sessionService.deleteSession(id)
}