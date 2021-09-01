package pl.straburzynski.campfiresongs.service;

import org.junit.jupiter.api.Test;
import pl.straburzynski.campfiresongs.externalapi.service.ExternalApiParserService;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ExternalApiParserServiceTest {

    @Test
    public void convertTagToChord_forAnnotationType() {
        // given
        String code = "<code class=\"an\" data-chord=\"E\" data-suffix=\"m\" data-local=\"e\">e</code>";

        // when
        String chord = ExternalApiParserService.convertTagToChord("code", code, true);

        //then
        assertEquals("|@e|", chord);
    }

    @Test
    public void convertTagToChord_forSideType() {
        // given
        String code = "<code data-chord=\"E\" data-suffix=\"m\" data-local=\"e\">e</code>";

        // when
        String chord = ExternalApiParserService.convertTagToChord("code", code, false);

        //then
        assertEquals("|#e|", chord);
    }

    @Test
    public void convertRawLineToChordFormatted_forAnnotationType() {
        // given
        String line = "<code class=\"an\" data-chord=\"B\" data-suffix=\"m\" data-local=\"h\">h</code>First part,<code class=\"an\" data-chord=\"A#\" data-suffix=\"\" data-local=\"B\">B</code> second part ";

        // when
        String formattedLine = ExternalApiParserService.convertRawLineToChordFormatted(line);

        //then
        assertEquals("|@h|First part,|@B| second part ", formattedLine);
    }

    @Test
    public void convertRawLineToChordFormatted_forSideType() {
        // given
        String line = "First part&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <code data-chord=\"B\" data-suffix=\"m\" data-local=\"h\">h</code> <code data-chord=\"A\" data-suffix=\"\" data-local=\"A\">A</code> <code data-chord=\"D\" data-suffix=\"\" data-local=\"D\">D</code>";

        // when
        String formattedLine = ExternalApiParserService.convertRawLineToChordFormatted(line);

        //then
        assertEquals("First part&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |#h| |#A| |#D|", formattedLine);
    }

}
