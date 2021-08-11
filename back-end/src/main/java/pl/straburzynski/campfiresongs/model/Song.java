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
@Table(name = "SONG")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Song {

    @Id
    @Column(name = "ID")
    @Type(type = "uuid-char")
    private UUID id;

    @Column(name = "AUTHOR")
    private String author;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "LYRICS", length = 2000)
    private String lyrics;

}
