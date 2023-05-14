package pl.straburzynski.campfiresongs.externalapi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ExternalApiSong {
    private String title;
    private String url;
    private String artist;
    private ExternalApiSource source;
}
