import { ChordModel } from '../model/ChordModel';
import { Chord, Interval } from 'tonal';
import { DIGITS, SPACE } from '../config/ChordConfig';
import guitar from '../resources/chords/guitar.json';
import ukulele from '../resources/chords/ukulele.json';
import { InstrumentEnum } from '../model/InstrumentEnum';

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

const allElementsAreChords = (longestWord: number, elements: string[]): boolean =>
    longestWord <= 4 && elements.map(el => getChord(el)).every(chord => !chord.empty);

export const rowWithChordsOnlyDetected = (row: string): boolean => {
    if (row === "") return false;
    const elements = row.split(SPACE);
    const spaces = elements.filter(value => value === '');
    const words = elements.filter(value => value !== '');
    const longestWord = Math.max(...(words.map(w => w.replace(DIGITS, '').length)));
    return (spaces.length > words.length) || allElementsAreChords(longestWord, words.filter(el => el !== '|'));
};

export const getChord = (chordName: string, transposition: number = 0): ChordModel => {
    const chord = Chord.get(chordName);
    if (transposition !== 0 && !chord.empty) {
        const transposedChord = normalizeTransposition(Chord.transpose(chord.symbol, Interval.fromSemitones(transposition)));
        return Chord.get(transposedChord);
    }
    return chord;
};

export const getChordName = (chordName: string, transposition: number = 0): string => {
    return transposition === 0 ? chordName : getChord(chordName, transposition).symbol.replace('M', '');
};

export const getMultipleChordPositions = (instrument: InstrumentEnum, chords: ChordModel[]) => {
    return chords.map((chord) => getChordPositions(instrument, chord));
};

const findChordPositions = (chord: ChordModel, instrument: any) => {
    if (!chord.tonic) return;
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

const normalizeTransposition = (chordName: string) => chordName
    .replace('Db', 'C#')
    .replace('Eb', 'D#')
    .replace('Gb', 'F#')
    .replace('Ab', 'G#')
    .replace('Bb', 'A#')
    .replace('E#', 'F')
    .replace('B#', 'A');
