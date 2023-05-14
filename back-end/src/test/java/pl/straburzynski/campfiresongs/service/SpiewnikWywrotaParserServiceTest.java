package pl.straburzynski.campfiresongs.service;

import org.junit.jupiter.api.Test;
import pl.straburzynski.campfiresongs.externalapi.service.parser.SpiewnikWywrotaParserService;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SpiewnikWywrotaParserServiceTest {

    @Test
    public void convertTagToChord_forAnnotationType() {
        // given
        String code = "<code class=\"an\" data-chord=\"E\" data-suffix=\"m\" data-local=\"e\">e</code>";

        // when
        String chord = SpiewnikWywrotaParserService.convertTagToChord("code", code, true);

        //then
        assertEquals("|@Em|", chord);
    }

    @Test
    public void convertTagToChord_forSideType() {
        // given
        String code = "<code data-chord=\"E\" data-suffix=\"m\" data-local=\"e\">e</code>";

        // when
        String chord = SpiewnikWywrotaParserService.convertTagToChord("code", code, false);

        //then
        assertEquals("|#Em|", chord);
    }

    @Test
    public void convertRawLineToChordFormatted_forAnnotationType() {
        // given
        String line = "<code class=\"an\" data-chord=\"B\" data-suffix=\"m\" data-local=\"h\">h</code>First part,<code class=\"an\" data-chord=\"A#\" data-suffix=\"\" data-local=\"B\">B</code> second part ";

        // when
        String formattedLine = SpiewnikWywrotaParserService.convertRawLineToChordFormatted(line);

        //then
        assertEquals("|@Bm|First part,|@A#| second part ", formattedLine);
    }

    @Test
    public void convertRawLineToChordFormatted_forSideType() {
        // given
        String line = "First part&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <code data-chord=\"B\" data-suffix=\"m\" data-local=\"h\">h</code> <code data-chord=\"A\" data-suffix=\"\" data-local=\"A\">A</code> <code data-chord=\"D\" data-suffix=\"\" data-local=\"D\">D</code>";

        // when
        String formattedLine = SpiewnikWywrotaParserService.convertRawLineToChordFormatted(line);

        //then
        assertEquals("First part&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |#Bm| |#A| |#D|", formattedLine);
    }

}
