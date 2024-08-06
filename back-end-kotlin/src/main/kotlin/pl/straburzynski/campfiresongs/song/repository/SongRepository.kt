package pl.straburzynski.campfiresongs.song.repository

import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
import pl.straburzynski.campfiresongs.song.model.Song
import java.util.UUID

@Repository
interface SongRepository : CoroutineCrudRepository<Song, UUID> {
    override fun findAll(): Flow<Song>
    override suspend fun findById(id: UUID): Song?
    override suspend fun existsById(id: UUID): Boolean
    override suspend fun <S : Song> save(entity: S): Song
    override suspend fun deleteById(id: UUID)
    suspend fun existsByAuthorLikeAndTitleLikeAllIgnoreCase(author: String, title: String): Boolean
}