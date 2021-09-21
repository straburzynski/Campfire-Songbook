package pl.straburzynski.campfiresongs.session.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import pl.straburzynski.campfiresongs.song.model.Song;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "SESSION")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Session {

    @Id
    @Column(name = "ID", nullable = false)
    @Type(type = "uuid-char")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "SONG_ID")
    private Song song;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "TEMPORARY")
    private boolean temporary = false;

    @Column(name = "SONG_DATA", length = Integer.MAX_VALUE)
    private String songData;

}
