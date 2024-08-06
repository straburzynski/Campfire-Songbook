package pl.straburzynski.campfiresongs.song.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.util.UUID

@Table(name = "SONGS")
data class Song(
    @Id var id: UUID? = null,
    val author: String,
    val title: String,
    val lyrics: String
)

