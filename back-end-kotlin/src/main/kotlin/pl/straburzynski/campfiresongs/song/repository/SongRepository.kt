package pl.straburzynski.campfiresongs.song.repository

import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
import pl.straburzynski.campfiresongs.song.model.Song

@Repository
interface SongRepository : CoroutineCrudRepository<Song, Int> {
    override fun findAll(): Flow<Song>
    override suspend fun findById(id: Int): Song?
    override suspend fun existsById(id: Int): Boolean
    override suspend fun <S : Song> save(entity: S): Song
    override suspend fun deleteById(id: Int)
    suspend fun existsByAuthorLikeAndTitleLikeAllIgnoreCase(author: String, title: String): Boolean
}