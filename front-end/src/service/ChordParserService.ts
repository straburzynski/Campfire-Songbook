import { ChordDetails } from '../model/ChordDetails';
import { ChordModel } from '../model/ChordModel';
import { Chord } from 'tonal';
import { CHORDS_MAPPING } from '../config/ChordConfig';
import guitar from '../resources/chords/guitar.json';
import ukulele from '../resources/chords/ukulele.json';
import { InstrumentEnum } from '../model/InstrumentEnum';
import { Interval } from 'tonal';

export const getChordPositions = (instrument: InstrumentEnum, chord: ChordModel) => {
    if (chord != null) {
        switch (instrument) {
            case InstrumentEnum.GUITAR:
                return findChordPositions(chord, guitar);
            case InstrumentEnum.UKULELE:
                return findChordPositions(chord, ukulele);
        }
    }
};

const transposeChordName = (foundChordName: string, transpose: number) => {
    const transposedChord = normalizeTransposition(Chord.transpose(foundChordName, Interval.fromSemitones(transpose)));
    return Chord.get(transposedChord).symbol.replace('M', '');
};

export const translateChordName = (chordName: string, transpose: number = 0): string => {
    const chord = extractChord(chordName);
    if (chord != null) {
        const foundChord = Chord.getChord(chord.suffix, chord.key);
        if (transpose !== 0) {
            return transposeChordName(foundChord.name, transpose);
        }
        return foundChord.symbol.replace('M', '');
    } else {
        return '';
    }
};

export const getChord = (chordName: string, transpose: number = 0): ChordModel => {
    const chord = extractChord(chordName);
    let foundChord;
    if (chord != null) {
        foundChord = Chord.getChord(chord.suffix, chord.key);
        if (transpose !== 0) {
            foundChord = Chord.get(normalizeTransposition(Chord.transpose(foundChord.name, Interval.fromSemitones(transpose))));
        }
    } else {
        foundChord = Chord.get('');
    }
    return foundChord;
};

const findChordPositions = (chord: ChordModel, instrument: any) => {
    if (!chord.tonic) return
    if (instrument.chords.hasOwnProperty(chord.tonic)) {
        const foundChord = instrument.chords[chord.tonic]?.filter((i) => {
            return i.suffix === selectSuffix(chord);
        });
        if (foundChord.length > 0) {
            return foundChord[0].positions;
        }
    }
    return;
};

const selectSuffix = (chord: ChordModel): string => {
    if (chord.type === 'minor' || chord.type === 'major') {
        return chord.type;
    }
    return chord.tonic ? chord.symbol.replace(chord.tonic, '') : chord.symbol;
};

export const getMultipleChordPositions = (instrument: InstrumentEnum, chords: ChordModel[]) => {
    return chords.map((chord) => getChordPositions(instrument, chord));
};

const parseByKey = (key: string, parsedKey: string) => {
    return {
        key: parsedKey,
        suffix: isUpperCase(key) ? 'major' : 'minor',
    };
};

const normalizeTransposition = (chordName: string) => chordName
    .replace('Eb', 'D#')
    .replace('Ab', 'G#')
    .replace('Bb', 'A#')
    .replace('E#', 'F')
    .replace('B#', 'A');

const extractChord = (chordName: string): ChordDetails | undefined => {
    // todo extract to tonal chord object
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
                    return {
                        key: parsedKey,
                        suffix: suffix,
                    };
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

const isUpperCase = (string) => /^[A-Z]*$/.test(string);
const suffixes: string[] = guitar.suffixes;
