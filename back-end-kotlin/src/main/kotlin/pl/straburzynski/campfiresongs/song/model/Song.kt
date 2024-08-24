package pl.straburzynski.campfiresongs.song.model


import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.UuidGenerator
import java.util.UUID

@Entity
@Table(name = "SONGS")
data class Song(
    @Id
    @Column(name = "ID", nullable = false)
    @UuidGenerator
    var id: UUID? = null,

    @Column(name = "AUTHOR")
    val author: String,

    @Column(name = "TITLE")
    val title: String,

    @Column(name = "LYRICS", length = Int.MAX_VALUE)
    val lyrics: String
)
