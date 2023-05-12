import { ChordType } from '@tonaljs/chord-type';
import { NoteName } from '@tonaljs/core';

export interface ChordModel extends ChordType {
    tonic: string | null;
    type: string;
    root: string;
    rootDegree: number;
    symbol: string;
    notes: NoteName[];
}
