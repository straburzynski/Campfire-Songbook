package pl.straburzynski.campfiresongs.song.service

import kotlinx.coroutines.flow.toList
import org.springframework.dao.DataAccessException
import org.springframework.stereotype.Service
import pl.straburzynski.campfiresongs.song.exception.CannotUpdateSongException
import pl.straburzynski.campfiresongs.song.exception.SongExistsException
import pl.straburzynski.campfiresongs.song.exception.SongNotFoundException
import pl.straburzynski.campfiresongs.song.model.Song
import pl.straburzynski.campfiresongs.song.model.SongDto
import pl.straburzynski.campfiresongs.song.model.SongHeadersDto
import pl.straburzynski.campfiresongs.song.repository.SongRepository
import java.util.UUID


@Service
class SongService(
    private val songRepository: SongRepository,
    private val songConverter: SongConverter
) {
    suspend fun create(songDto: SongDto): Song {
        val exists = songRepository.existsByAuthorLikeAndTitleLikeAllIgnoreCase(songDto.author, songDto.title)
        if (exists) throw SongExistsException(songDto)
        val savedSong = songRepository.save(
            Song(author = songDto.author, title = songDto.title, lyrics = songDto.lyrics)
        )
        return savedSong
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

    suspend fun findById(id: UUID): SongDto {
        val song = songRepository.findById(id) ?: throw SongNotFoundException(id.toString())
        return songConverter.convertFromSong(song)
    }

    suspend fun update(id: UUID, songDto: SongDto): Song {
        val song = songConverter.convertFromSongDto(songDto)
        return try {
            songRepository.save(song.copy(id = id))
        } catch (ex: DataAccessException) {
            throw CannotUpdateSongException(songDto)
        }
    }

    suspend fun deleteById(id: UUID) {
        songRepository.deleteById(id)
    }
}