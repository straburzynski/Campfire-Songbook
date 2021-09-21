package pl.straburzynski.campfiresongs.song.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straburzynski.campfiresongs.song.model.Song;

import java.util.UUID;

@Repository
public interface SongRepository extends JpaRepository<Song, UUID> {

    boolean existsByAuthorLikeAndTitleLikeAllIgnoreCase(String author, String title);

}
