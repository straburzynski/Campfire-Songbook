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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final SongConverter songConverter;

    public Song create(SongDto songDto) {
        Song song = songConverter.convertFromSongDto(songDto);
        boolean exists = songRepository.existsByAuthorLikeAndTitleLikeAllIgnoreCase(song.getAuthor(), song.getTitle());
        if (exists) {
            throw new SongExistsException(song);
        } else {
            song.setId(UUID.randomUUID());
            return songRepository.save(song);
        }
    }

    public List<SongDto> findAll() {
        return songRepository.findAll().stream()
                .map(songConverter::convertFromSong)
                .collect(Collectors.toList());
    }

    public SongDto findById(UUID id) {
        Song song = songRepository.findById(id).orElseThrow(() -> new SongNotFoundException(id));
        return songConverter.convertFromSong(song);
    }

    public Song update(UUID id, SongDto songDto) {
        Song song = songConverter.convertFromSongDto(songDto);
        song.setId(id);
        return songRepository.save(song);
    }

    public void deleteById(UUID id) {
        songRepository.deleteById(id);
    }
}
