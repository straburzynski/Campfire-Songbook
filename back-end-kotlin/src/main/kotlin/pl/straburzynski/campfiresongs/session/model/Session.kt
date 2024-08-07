package pl.straburzynski.campfiresongs.session.model

import jakarta.persistence.CascadeType.ALL
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.annotations.UuidGenerator
import pl.straburzynski.campfiresongs.song.model.Song
import java.util.UUID


@Entity
@Table(name = "SESSIONS")
data class Session(
    @Id
    @Column(name = "ID", nullable = false)
    @UuidGenerator
    var id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY, cascade = [ALL])
    @JoinColumn(name = "SONGS_ID")
    var song: Song? = null,

    @Column(name = "NAME")
    val name: String,

    @Column(name = "PASSWORD")
    val password: String,

    @Column(name = "TEMPORARY")
    var temporary: Boolean = false,

    @Column(name = "SONG_DATA", length = Int.MAX_VALUE)
    var songData: String? = null
)
