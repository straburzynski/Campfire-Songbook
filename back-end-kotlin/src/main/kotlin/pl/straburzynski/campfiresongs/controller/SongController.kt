package pl.straburzynski.campfiresongs.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import pl.straburzynski.campfiresongs.song.model.Song
import pl.straburzynski.campfiresongs.song.model.SongDto
import pl.straburzynski.campfiresongs.song.service.SongService


@RestController
@RequestMapping(value = ["songs"])
class SongController(val songService: SongService) {

    @GetMapping
    suspend fun findAll(@RequestParam(defaultValue = "true") offline: Boolean): ResponseEntity<*> {
        return ResponseEntity<Any>(
            if (offline) songService.findAll()
            else songService.findAllHeaders(), HttpStatus.OK
        )
    }

    @PostMapping
    suspend fun create(@RequestBody songDto: SongDto): Song = songService.create(songDto)

    @PutMapping("{id}")
    suspend fun update(@PathVariable id: Int, @RequestBody songDto: SongDto): Song = songService.update(id, songDto)

    @GetMapping("{id}")
    suspend fun findById(@PathVariable id: Int): SongDto = songService.findById(id)

    @DeleteMapping("{id}")
    suspend fun deleteById(@PathVariable id: Int) = songService.deleteById(id)

    @PostMapping("batch")
    suspend fun batchCreate(@RequestBody songs: List<SongDto>) = songs.forEach { song -> songService.create(song) }
}
