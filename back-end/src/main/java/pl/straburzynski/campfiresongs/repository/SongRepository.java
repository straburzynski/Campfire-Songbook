package pl.straburzynski.campfiresongs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straburzynski.campfiresongs.model.Song;

import java.util.UUID;

@Repository
public interface SongRepository extends JpaRepository<Song, UUID> {

}
