package pl.straburzynski.campfiresongs.session.repository

import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import pl.straburzynski.campfiresongs.session.model.Session
import java.util.Optional
import java.util.UUID


@Repository
interface SessionRepository : CrudRepository<Session, UUID> {

    @EntityGraph(attributePaths = ["song"])
    fun findByName(name: String): Session?

    @EntityGraph(attributePaths = ["song"])
    override fun findById(id: UUID): Optional<Session>
}
