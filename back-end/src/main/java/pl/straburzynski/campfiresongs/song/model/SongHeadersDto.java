package pl.straburzynski.campfiresongs.song.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SongHeadersDto {
    private UUID id;
    private String author;
    private String title;
}
