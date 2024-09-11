package pl.straburzynski.campfiresongs.externalapi.service.parser

import java.util.logging.Logger
import java.util.regex.Pattern
import org.jsoup.Jsoup.parseBodyFragment
import org.jsoup.nodes.Document
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiResponse
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSong
import pl.straburzynski.campfiresongs.externalapi.model.ExternalApiSource.SPIEWNIK_WYWROTA

class SpiewnikWywrotaParserService {

    companion object {
        private val logger: Logger = Logger.getLogger(this::class.java.name)

        private const val DEFAULT_TAG_NAME: String = "code"
        private const val ANNOTATION_CLASS: String = "class=\"an\""
        private const val CONTENT: String = "interpretation-content"
        private const val NEW_LINE_CHARACTER: String = "\n"
        private const val ANNOTATION_TAG_START: String = "<span class=\"annotated-lyrics\">"
        private const val ANNOTATION_TAG_END: String = "</span>"
        private const val MUTED_TAG_START: String = "<span class=\"text-muted\">"
        private const val HTML_BREAK_LINE: String = "<br>"
        private const val HTML_HARD_SPACE: String = "&nbsp;"

        private val REGEX_PATTERN = Pattern.compile("<$DEFAULT_TAG_NAME.*?>(.+?)</$DEFAULT_TAG_NAME>")

        private fun convertDocumentToLines(document: Document): List<String> {
            val contentElement = document.getElementsByClass(CONTENT).stream().findFirst()
                .orElseThrow { ExternalApiException("parseDocument") }
            val lines = contentElement.html().split(NEW_LINE_CHARACTER)
            return lines.map {
                it
                    .replace(ANNOTATION_TAG_START, "")
                    .replace(MUTED_TAG_START, "")
                    .replace(ANNOTATION_TAG_END, "")
                    .replace(HTML_BREAK_LINE, "")
                    .replace(HTML_HARD_SPACE, "")
            }.toList()
        }

        fun parseLyricsFromDocument(document: Document): String {
            val lines: List<String> = convertDocumentToLines(document)
            return lines
                .map { convertRawLineToChordFormatted(it) }
                .joinToString(NEW_LINE_CHARACTER)
        }

        fun parseSearchResults(response: ExternalApiResponse?): List<ExternalApiSong> =
            if (response?.songs != null) {
                response.songs.map {
                    ExternalApiSong(
                        it.title,
                        it.url,
                        it.artist,
                        SPIEWNIK_WYWROTA
                    )
                }.toList()
            } else emptyList()


        fun convertTagToChord(code: String, isAnnotation: Boolean): String =
            convertTagToChord(DEFAULT_TAG_NAME, code, isAnnotation)

        fun convertTagToChord(tagName: String, tagWithContent: String, isAnnotation: Boolean): String {
            val code = parseBodyFragment(tagWithContent).getElementsByTag(tagName).first()
            return if (code == null) {
                logger.info("Didn't find any value in tag: $tagWithContent")
                ""
            } else {
                val chordName = code.attr("data-chord") + code.attr("data-suffix")
                if (chordName == "") return ""
                "|${if (isAnnotation) "@" else "#"}$chordName|"
            }
        }

        fun convertRawLineToChordFormatted(line: String): String {
            var convertedLine = line
            val isAnnotation = convertedLine.contains(ANNOTATION_CLASS)
            val matcher = REGEX_PATTERN.matcher(convertedLine)
            while (matcher.find()) {
                convertedLine = convertedLine.replace(
                    matcher.group(0), convertTagToChord(matcher.group(0), isAnnotation)
                )
            }
            return convertedLine
        }
    }
}
