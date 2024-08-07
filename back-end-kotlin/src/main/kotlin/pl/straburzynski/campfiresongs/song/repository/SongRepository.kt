package pl.straburzynski.campfiresongs.song.repository

import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
import pl.straburzynski.campfiresongs.song.model.Song
import java.util.UUID


@Repository
interface SongRepository : CrudRepository<Song, UUID> {
//    override fun findAll(): List<Song>
//    override fun findById(id: UUID): Song?
//    override fun existsById(id: UUID): Boolean
//    override fun <S : Song> save(entity: S): Song
//    override fun deleteById(id: UUID)
    fun existsByAuthorLikeAndTitleLikeAllIgnoreCase(author: String, title: String): Boolean
}