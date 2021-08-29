package pl.straburzynski.campfiresongs.service;

import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.model.Song;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExternalApiSongService {

    public List<Song> searchByTitle(String title) {
        return new ArrayList<>();
    }

}
