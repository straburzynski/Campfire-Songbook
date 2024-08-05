package pl.straburzynski.campfiresongs.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
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
    suspend fun findById(@PathVariable id: String): SongDto = songService.findById(id)

    @DeleteMapping("{id}")
    suspend fun deleteById(@PathVariable id: String) = songService.deleteById(id)

    @PostMapping("batch")
    suspend fun batchCreate(@RequestBody songs: List<SongDto>) = songs.forEach { song -> songService.create(song) }

    //    tmp
    @GetMapping("tmp")
    suspend fun createTest1(): Song {
        val s = SongDto(99, "a", "t", "l")
        val create = songService.create(s)
        return create
    }

}
