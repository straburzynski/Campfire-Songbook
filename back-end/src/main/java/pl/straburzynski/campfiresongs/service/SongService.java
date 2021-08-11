package pl.straburzynski.campfiresongs.service;

import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.exception.SongNotFoundException;
import pl.straburzynski.campfiresongs.model.Song;
import pl.straburzynski.campfiresongs.repository.SongRepository;

import java.util.List;
import java.util.UUID;

@Service
public class SongService {

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public List<Song> findAll() {
        return songRepository.findAll();
    }

    public Song findById(UUID id) {
        return songRepository.findById(id).orElseThrow(() -> new SongNotFoundException(id));
    }

}
