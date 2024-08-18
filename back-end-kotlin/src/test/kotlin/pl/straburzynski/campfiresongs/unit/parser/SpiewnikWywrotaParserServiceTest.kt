package pl.straburzynski.campfiresongs.unit.parser

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import pl.straburzynski.campfiresongs.externalapi.service.parser.SpiewnikWywrotaParserService.Companion.convertRawLineToChordFormatted
import pl.straburzynski.campfiresongs.externalapi.service.parser.SpiewnikWywrotaParserService.Companion.convertTagToChord

class SpiewnikWywrotaParserServiceTest : FunSpec({

    context("SpiewnikWywrotaParserService.convertTagToChord") {

        test("should convert minor chord with annotation type") {
            // given
            val code = """<code class="an" data-chord="E" data-suffix="m" data-local="e">e</code>"""

            // when
            val chord = convertTagToChord("code", code, true)

            //then
            chord shouldBe "|@Em|"
        }

        test("should convert major chord with annotation type") {
            // given
            val code = """<code class="an" data-chord="E" data-suffix data-local="E">E</code>"""

            // when
            val chord = convertTagToChord("code", code, true)

            //then
            chord shouldBe "|@E|"
        }

        test("should convert minor chord with side type") {
            // given
            val code = """<code data-chord="E" data-suffix="m" data-local="e">e</code>"""

            // when
            val chord = convertTagToChord("code", code, false)

            //then
            chord shouldBe "|#Em|"
        }

        test("should convert major chord with side type") {
            // given
            val code = """<code data-chord="E" data-suffix data-local="E">E</code>"""

            // when
            val chord = convertTagToChord("code", code, false)

            //then
            chord shouldBe "|#E|"
        }

        test("should return empty string when code tag is invalid") {
            // given
            val code = """<invalid-tag data-chord="E" data-suffix data-local="E">E</invalid-tag>"""

            // when
            val chord = convertTagToChord("code", code, false)

            // then
            chord shouldBe ""
        }

        test("should return empty string when code tag contains no data") {
            // given
            val code = """<code></code>"""

            // when
            val chord = convertTagToChord("code", code, false)

            // then
            chord shouldBe ""
        }
    }

    context("SpiewnikWywrotaParserService.convertRawLineToChordFormatted") {

        test("should convert raw line to chord formatted for annotation type") {
            // given
            val line =
                """<code class="an" data-chord="B" data-suffix="m" data-local="h">h</code>First part,<code class="an" data-chord="A#" data-suffix="" data-local="B">B</code> second part"""

            // when
            val formattedLine = convertRawLineToChordFormatted(line)

            //then
            formattedLine shouldBe "|@Bm|First part,|@A#| second part"
        }

        test("should convert raw line to chord formatted for side type") {
            // given

            // given
            val line =
                """First part&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <code data-chord="B" data-suffix="m" data-local="h">h</code> <code data-chord="A" data-suffix="" data-local="A">A</code> <code data-chord="D" data-suffix="" data-local="D">D</code>"""

            // when
            val formattedLine = convertRawLineToChordFormatted(line)

            //then
            formattedLine shouldBe
                    "First part&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |#Bm| |#A| |#D|"
        }

        test("should convert raw line to chord formatted when chords are invalid") {
            // given
            val line =
                """<code>h</code>First part,<code>B</code> second part"""

            // when
            val formattedLine = convertRawLineToChordFormatted(line)

            //then
            formattedLine shouldBe "First part, second part"
        }
    }

})