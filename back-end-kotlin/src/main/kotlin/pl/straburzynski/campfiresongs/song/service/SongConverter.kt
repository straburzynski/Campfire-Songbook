package pl.straburzynski.campfiresongs.song.service

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Service
import pl.straburzynski.campfiresongs.song.exception.JsonParseException
import pl.straburzynski.campfiresongs.song.model.Song
import pl.straburzynski.campfiresongs.song.model.SongDto


@Service
class SongConverter(private val objectMapper: ObjectMapper) {

    fun stringifyFromSongDto(songDto: SongDto?): String = try {
        objectMapper.writeValueAsString(songDto)
    } catch (e: JsonProcessingException) {
        throw JsonParseException("stringifyFromSongDto")
    }

    fun convertFromSongDto(songDto: SongDto?): Song =
        objectMapper.convertValue(songDto, Song::class.java)

    fun parseFromSongData(songData: String?): SongDto = try {
        objectMapper.readValue(songData, SongDto::class.java)
    } catch (e: JsonProcessingException) {
        throw JsonParseException("parseFromSongData")
    }

    fun convertFromSong(song: Song?): SongDto =
        objectMapper.convertValue(song, SongDto::class.java)
}