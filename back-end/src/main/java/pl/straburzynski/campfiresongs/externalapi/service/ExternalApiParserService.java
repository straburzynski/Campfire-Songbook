package pl.straburzynski.campfiresongs.externalapi.service;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import pl.straburzynski.campfiresongs.externalapi.exception.ExternalApiException;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
public class ExternalApiParserService {

    private final static String DEFAULT_TAG_NAME = "code";
    private final static String ANNOTATION_CLASS = "class=\"an\"";
    private final static String CONTENT = "interpretation-content";
    private final static String NEW_LINE_CHARACTER = "\n";
    private final static String ANNOTATION_TAG_START = "<span class=\"annotated-lyrics\">";
    private final static String ANNOTATION_TAG_END = "</span>";
    private final static String MUTED_TAG_START = "<span class=\"text-muted\">";
    private final static String HTML_BREAK_LINE = "<br>";
    private final static String HTML_HARD_SPACE = "&nbsp;";

    public static String getRegexPatternForTag(String tagName) {
        return "<" + tagName + ".*?>(.+?)</" + tagName + ">";
    }

    public static String getRegexPatternForTag() {
        return "<" + DEFAULT_TAG_NAME + ".*?>(.+?)</" + DEFAULT_TAG_NAME + ">";
    }

    public static String convertTagToChord(String code, boolean isAnnotation) {
        return convertTagToChord(DEFAULT_TAG_NAME, code, isAnnotation);
    }

    public static String convertTagToChord(String tagName, String tagWithContent, boolean isAnnotation) {
        String regex = getRegexPatternForTag(tagName);
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(tagWithContent);
        if (matcher.find()) {
            String chord = matcher.group(1);
            return "|" + (isAnnotation ? "@" : "#") + chord + "|";
        } else {
            log.debug("Didn't find any value in tag");
            return tagWithContent;
        }
    }

    public static String convertRawLineToChordFormatted(String line) {
        boolean isAnnotation = line.contains(ANNOTATION_CLASS);
        Pattern pattern = Pattern.compile(getRegexPatternForTag());
        Matcher matcher = pattern.matcher(line);
        while (matcher.find()) {
            line = line.replace(matcher.group(0), convertTagToChord(matcher.group(0), isAnnotation));
        }
        return line;
    }

    public static List<String> convertDocumentToLines(Document document) {
        Element contentElement = document.getElementsByClass(CONTENT).stream().findFirst()
                .orElseThrow(() -> new ExternalApiException("parseDocument"));
        String[] split = contentElement.html().split(NEW_LINE_CHARACTER);
        List<String> lines = Arrays.asList(split);
        return lines.stream().map(line -> line
                .replaceAll(ANNOTATION_TAG_START, "")
                .replaceAll(MUTED_TAG_START, "")
                .replaceAll(ANNOTATION_TAG_END, "")
                .replaceAll(HTML_BREAK_LINE, "")
                .replaceAll(HTML_HARD_SPACE, "")
        ).collect(Collectors.toList());
    }

    public static String parseLyricsFromDocument(Document document) {
        List<String> lines = convertDocumentToLines(document);
        return lines.stream()
                .map(ExternalApiParserService::convertRawLineToChordFormatted)
                .collect(Collectors.joining(NEW_LINE_CHARACTER));
    }
}
