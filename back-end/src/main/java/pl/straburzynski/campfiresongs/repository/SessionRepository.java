package pl.straburzynski.campfiresongs.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straburzynski.campfiresongs.model.Session;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {

    @EntityGraph(attributePaths = {"song"})
    Optional<Session> findByName(String name);

}
