package pl.straburzynski.campfiresongs.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "SESSION")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Session {

    @Id
    @Column(name = "ID")
    @Type(type = "uuid-char")
    private UUID id;

    @Column(name = "SONG_ID")
    @Type(type = "uuid-char")
    private UUID songId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "PASSWORD")
    private String password;

}
