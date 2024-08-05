package pl.straburzynski.campfiresongs.song.service

import kotlinx.coroutines.flow.toList
import org.springframework.stereotype.Service
import pl.straburzynski.campfiresongs.song.exception.SongExistsException
import pl.straburzynski.campfiresongs.song.exception.SongNotFoundException
import pl.straburzynski.campfiresongs.song.model.Song
import pl.straburzynski.campfiresongs.song.model.SongDto
import pl.straburzynski.campfiresongs.song.model.SongHeadersDto
import pl.straburzynski.campfiresongs.song.repository.SongRepository

@Service
class SongService(
    private val songRepository: SongRepository,
    private val songConverter: SongConverter
) {
    suspend fun create(songDto: SongDto?): Song {
        val song: Song = songConverter.convertFromSongDto(songDto)
        val exists: Boolean =
            songRepository.existsByAuthorLikeAndTitleLikeAllIgnoreCase(song.author, song.title)
        if (exists) {
            throw SongExistsException(song)
        } else {
            song.id = null
            val savedSong = songRepository.save(song)
            return savedSong
        }
    }

    suspend fun findAll(): List<SongDto> {
        return songRepository.findAll().toList()
            .map(songConverter::convertFromSong)
    }

    suspend fun findAllHeaders(): List<SongHeadersDto> {
        return findAll()
            .map { songDto: SongDto ->
                SongHeadersDto(
                    songDto.id,
                    songDto.author,
                    songDto.title
                )
            }
    }

    suspend fun findById(id: String): SongDto {
        val song = songRepository.findById(id) ?: throw SongNotFoundException(id)
        return songConverter.convertFromSong(song)
    }

    suspend fun update(id: Int, songDto: SongDto): Song {
        val song: Song = songConverter.convertFromSongDto(songDto)
        song.id = id
        return songRepository.save(song)
    }

    suspend fun deleteById(id: String) {
        songRepository.deleteById(id)
    }
}