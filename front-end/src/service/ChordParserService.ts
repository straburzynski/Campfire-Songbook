import { ChordDetails } from '../model/ChordDetails';
import { CHORDS_MAPPING } from '../config/ChordConfig';
import guitar from '../resources/chords/guitar.json';

export const getChordPositions = (chordName: string) => {
    const chord = extractChord(chordName);
    if (chord != null) {
        const foundChords = guitar.chords[chord.key].filter((i) => i.suffix === chord.suffix)[0];
        return foundChords.positions;
    }
};

export const getMultipleChordPositions = (chordNames: string[]) => {
    return chordNames.map((chordName) => getChordPositions(chordName));
};

const isUpperCase = (string) => /^[A-Z]*$/.test(string);
const suffixes: string[] = guitar.suffixes;

const parseByKey = (key: string, parsedKey: string) => {
    return {
        key: parsedKey,
        suffix: isUpperCase(key) ? 'major' : 'minor',
    };
};

const buildChord = (parsedKey, suffix: string) => {
    return {
        key: parsedKey,
        suffix: suffix,
    };
};

const extractChord = (chordName: string): ChordDetails | undefined => {
    if (chordName == null || chordName === '') {
        return;
    }
    chordName = chordName.trim();

    // chords like A, c, e
    if (chordName.length === 1) {
        const key = chordName.substr(0, 1);
        const parsedKey = CHORDS_MAPPING[key];
        return parseByKey(key, parsedKey);
    } else {
        // chords like Fis, cis
        if (chordName.includes('is')) {
            const key = chordName.substr(0, 3);
            const parsedKey = CHORDS_MAPPING[key];
            if (chordName.length === 3) {
                return parseByKey(key, parsedKey);
            } else {
                const suffix = chordName.slice(3);
                if (suffixes.includes(suffix)) {
                    return buildChord(parsedKey, suffix);
                }
            }
            // chords like Csus2, asus4
        } else {
            const key = chordName.substr(0, 1);
            const parsedKey = CHORDS_MAPPING[key];
            const suffix = chordName.slice(1);
            if (suffixes.includes(suffix)) {
                return {
                    key: parsedKey,
                    suffix: suffix,
                };
            }
        }
    }
};
