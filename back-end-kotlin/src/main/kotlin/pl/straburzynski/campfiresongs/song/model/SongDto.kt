package pl.straburzynski.campfiresongs.song.model

import java.util.UUID

data class SongDto(
    val id: UUID?,
    val author: String,
    val title: String,
    val lyrics: String
)
