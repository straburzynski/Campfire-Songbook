package pl.straburzynski.campfiresongs.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SessionDto {

    private UUID id;

    private SongDto song;

    private String name;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private boolean temporary;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String songData;

}
