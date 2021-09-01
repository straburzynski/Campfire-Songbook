package pl.straburzynski.campfiresongs.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "SONG")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Song {

    @Id
    @Column(name = "ID")
    @Type(type = "uuid-char")
    // todo id strategy handled by jpa
    private UUID id;

    @Column(name = "AUTHOR")
    private String author;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "LYRICS", length = 4000)
    private String lyrics;

}
