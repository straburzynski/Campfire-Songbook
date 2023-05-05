import { ChordDetails } from '../model/ChordDetails';
import Chord from '@tonaljs/chord';
import { CHORDS_MAPPING } from '../config/ChordConfig';
import guitar from '../resources/chords/guitar.json';
import ukulele from '../resources/chords/ukulele.json';
import { InstrumentEnum } from '../model/InstrumentEnum';
import { Interval } from 'tonal';

export const getChordPositions = (instrument: InstrumentEnum, chordName: string) => {
    const chord = extractChord(chordName);
    if (chord != null) {
        switch (instrument) {
            case InstrumentEnum.GUITAR:
                return findChordPositions(chord, guitar);
            case InstrumentEnum.UKULELE:
                return findChordPositions(chord, ukulele);
        }
    }
};

const transposeChord = (foundChordName: string, transpose: number) => {
    const transposedChord = Chord.transpose(foundChordName, Interval.fromSemitones(transpose));
    return Chord.get(transposedChord).symbol.replace('M', '');
};

export const translateChord = (chordName: string, transpose: number = 0): string => {
    const chord = extractChord(chordName);
    if (chord != null) {
        chord.key = chord.key.replace('sharp', '#');
        const foundChord = Chord.getChord(chord.suffix, chord.key);
        if (transpose != 0) {
            return transposeChord(foundChord.name, transpose);
        }
        return foundChord.symbol.replace('M', '');
    } else {
        return '';
    }
};

const findChordPositions = (chord: ChordDetails, instrument: any) => {
    if (instrument.chords.hasOwnProperty(chord.key)) {
        const foundChord = instrument.chords[chord.key]?.filter((i) => i.suffix === chord.suffix);
        if (foundChord.length > 0) {
            return foundChord[0].positions;
        }
    }
    return;
};

export const getMultipleChordPositions = (instrument: InstrumentEnum, chordNames: string[]) => {
    return chordNames.map((chordName) => getChordPositions(instrument, chordName));
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
        const key = chordName.substring(0, 1);
        const parsedKey = CHORDS_MAPPING[key];
        return parseByKey(key, parsedKey);
    } else {
        // chords like Fis, cis
        if (chordName.includes('is')) {
            const key = chordName.substring(0, 3);
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
            const key = chordName.substring(0, 1);
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
