package pl.straburzynski.campfiresongs.song.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table
data class Song(
    @Id var id: Int? = null,
    val author: String,
    val title: String,
    val lyrics: String
)

