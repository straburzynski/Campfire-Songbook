package pl.straburzynski.campfiresongs.session.model

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY
import pl.straburzynski.campfiresongs.song.model.SongDto
import java.util.UUID

data class SessionDto(
    val id: UUID?,
    val song: SongDto?,
    val name: String,
    @JsonProperty(access = WRITE_ONLY)
    val password: String?,
    @JsonProperty(access = WRITE_ONLY)
    val temporary: Boolean,
    val songData: String?
)
