package pl.straburzynski.campfiresongs.externalapi.model

data class ExternalApiResponse(
    val artists: List<ExternalApiArtist>,
    val songs: List<ExternalApiSong>?,
)
