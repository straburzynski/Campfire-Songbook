package pl.straburzynski.campfiresongs.song.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.song.exception.SongExistsException;
import pl.straburzynski.campfiresongs.song.exception.SongNotFoundException;
import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;
import pl.straburzynski.campfiresongs.song.repository.SongRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final SongConverter songConverter;

    public void create(SongDto songDto) {
        Song song = songConverter.convertFromSongDto(songDto);
        boolean exists = songRepository.existsByAuthorLikeAndTitleLikeAllIgnoreCase(song.getAuthor(), song.getTitle());
        if (exists) {
            throw new SongExistsException(song);
        } else {
            song.setId(UUID.randomUUID());
            songRepository.save(song);
        }
    }

    public List<Song> findAll() {
        return songRepository.findAll();
    }

    public Song findById(UUID id) {
        return songRepository.findById(id).orElseThrow(() -> new SongNotFoundException(id));
    }

    public void update(UUID id, SongDto songDto) {
        Song song = songConverter.convertFromSongDto(songDto);
        song.setId(id);
        songRepository.save(song);
    }

    public void deleteById(UUID id) {
        songRepository.deleteById(id);
    }
}
