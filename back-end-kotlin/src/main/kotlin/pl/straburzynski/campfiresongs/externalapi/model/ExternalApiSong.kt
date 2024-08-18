package pl.straburzynski.campfiresongs.externalapi.model

data class ExternalApiSong(
    val title: String,
    val url: String,
    val artist: String,
    val source: ExternalApiSource
)
