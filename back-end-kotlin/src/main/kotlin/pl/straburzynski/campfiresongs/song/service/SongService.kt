package pl.straburzynski.campfiresongs.song.service

import org.springframework.stereotype.Service
import pl.straburzynski.campfiresongs.song.exception.CannotUpdateSongException
import pl.straburzynski.campfiresongs.song.exception.SongExistsException
import pl.straburzynski.campfiresongs.song.exception.SongNotFoundException
import pl.straburzynski.campfiresongs.song.model.Song
import pl.straburzynski.campfiresongs.song.model.SongDto
import pl.straburzynski.campfiresongs.song.model.SongHeadersDto
import pl.straburzynski.campfiresongs.song.repository.SongRepository
import java.util.UUID
import kotlin.jvm.optionals.getOrNull


@Service
class SongService(
    private val songRepository: SongRepository,
    private val songConverter: SongConverter
) {
    fun create(songDto: SongDto): Song {
        val exists = songRepository.existsByAuthorLikeAndTitleLikeAllIgnoreCase(songDto.author, songDto.title)
        if (exists) throw SongExistsException(songDto)
        val savedSong = songRepository.save(
            Song(author = songDto.author, title = songDto.title, lyrics = songDto.lyrics)
        )
        return savedSong
    }

    fun findAll(): List<SongDto> = songRepository.findAll().toList()
        .map(songConverter::convertFromSong)

    fun findAllHeaders(): List<SongHeadersDto> = findAll()
        .map { songDto: SongDto ->
            SongHeadersDto(
                songDto.id,
                songDto.author,
                songDto.title
            )
        }

    fun findById(id: UUID): SongDto {
        val song = songRepository.findById(id).getOrNull() ?: throw SongNotFoundException(id.toString())
        return songConverter.convertFromSong(song)
    }

    fun update(id: UUID, songDto: SongDto): Song {
        val song = songConverter.convertFromSongDto(songDto)
        if (songRepository.existsById(id)) return songRepository.save(song)
        else throw CannotUpdateSongException(id, songDto)
    }

    fun deleteById(id: UUID) = songRepository.deleteById(id)
}