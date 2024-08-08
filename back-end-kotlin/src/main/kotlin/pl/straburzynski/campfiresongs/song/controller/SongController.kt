package pl.straburzynski.campfiresongs.song.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pl.straburzynski.campfiresongs.song.model.Song
import pl.straburzynski.campfiresongs.song.model.SongDto
import pl.straburzynski.campfiresongs.song.service.SongService
import java.util.UUID


@RestController
@RequestMapping(value = ["songs"])
class SongController(val songService: SongService) {

    @PostMapping
    fun create(@RequestBody songDto: SongDto): Song = songService.create(songDto)

    @PostMapping("batch")
    fun batchCreate(@RequestBody songs: List<SongDto>) = songs.map { song -> songService.create(song) }

    @GetMapping("{id}")
    fun findById(@PathVariable id: UUID): SongDto = songService.findById(id)

    @GetMapping
    fun findAll(@RequestParam(defaultValue = "true") offline: Boolean): ResponseEntity<*> = ResponseEntity<Any>(
        if (offline) songService.findAll()
        else songService.findAllHeaders(), HttpStatus.OK
    )

    @PutMapping("{id}")
    fun update(@PathVariable id: UUID, @RequestBody songDto: SongDto): Song = songService.update(id, songDto)

    @DeleteMapping("{id}")
    fun deleteById(@PathVariable id: UUID) = songService.deleteById(id)
}
