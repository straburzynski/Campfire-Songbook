package pl.straburzynski.campfiresongs.song.model

import java.util.UUID

data class SongHeadersDto(
    val id: UUID?,
    val author: String,
    val title: String,
)
