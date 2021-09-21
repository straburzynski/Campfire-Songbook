package pl.straburzynski.campfiresongs.session.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.straburzynski.campfiresongs.session.model.Session;
import pl.straburzynski.campfiresongs.session.model.SessionDto;
import pl.straburzynski.campfiresongs.song.service.SongConverter;

@Service
@RequiredArgsConstructor
public class SessionConverter {

    private final SongConverter songConverter;

    public SessionDto convertFromSession(Session session) {
        return SessionDto.builder()
                .id(session.getId())
                .name(session.getName())
                .password(session.getPassword())
                .song(session.isTemporary()
                        ? songConverter.parseFromSongData(session.getSongData())
                        : songConverter.convertFromSong(session.getSong()))
                .temporary(session.isTemporary())
                .songData(session.getSongData())
                .build();
    }

}
