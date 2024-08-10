package pl.straburzynski.campfiresongs.session.service

import org.springframework.stereotype.Service
import pl.straburzynski.campfiresongs.session.model.Session
import pl.straburzynski.campfiresongs.session.model.SessionDto
import pl.straburzynski.campfiresongs.song.service.SongConverter


@Service
class SessionConverter(val songConverter: SongConverter) {

    fun convertFromSession(session: Session): SessionDto = SessionDto(
        session.id,
        if (session.temporary)
            session.songData?.let { songConverter.parseFromSongData(session.songData) } else
            session.song?.let { songConverter.convertFromSong(it) },
        session.name,
        session.password,
        session.temporary,
        session.songData
    )
}
