import { useTranslation } from 'react-i18next';
import { getChord, getMultipleChordPositions, rowWithChordsOnlyDetected } from '../../../service/ChordParserService';
import instruments from '../../../resources/chords/instruments.json';
import React, { useContext, useState } from 'react';
import { Inplace, InplaceContent, InplaceDisplay } from 'primereact/inplace';
import { Button } from 'primereact/button';
import Chord from '@tombatossals/react-chords/lib/Chord';
import { ANNOTATION, NEW_LINE, SEPARATOR, SIDE, SPACE } from '../../../config/ChordConfig';
import './songChordDiagrams.scss';
import AppContext from '../../../context/AppContext';

const SongChordDiagrams = ({ lyrics, transposition }) => {
    const [chordsActive, setChordsActive] = useState(false);
    const { instrument } = useContext(AppContext);
    const { t } = useTranslation();

    const ChordsDiagrams = () => {
        let songChords = new Set<string>();
        lyrics.split(NEW_LINE).forEach((row: string) => {
            if (rowWithChordsOnlyDetected(row)) {
                row.split(SPACE)
                    .filter(chord => chord)
                    .forEach(chord => songChords.add(chord))
            }
            row.split(SEPARATOR).forEach((part: string) => {
                if (part.startsWith(ANNOTATION)) {
                    songChords.add(part.substring(1));
                } else if (part.startsWith(SIDE)) {
                    songChords.add(part.substring(1));
                }
            });
        });
        const chordList = Array.from(songChords).map(chordName => getChord(chordName, transposition));
        const multipleChordPositions = getMultipleChordPositions(instrument!, chordList);
        return (
            <div className='p-d-flex p-flex-row p-flex-wrap p-justify-center'>
                {multipleChordPositions.map((chord, index) => {
                    return chord ? (
                        <div key={index} className='chord-container p-d-flex p-flex-column p-ai-center p-jc-center'>
                            <h2>{chordList[index].symbol.replace('M', '')}</h2>
                            <Chord key={index} chord={chord[0]} instrument={instruments[instrument!]} />
                        </div>
                    ) : null;
                })}
            </div>
        );
    };

    return (
        <Inplace active={chordsActive} onToggle={(e) => setChordsActive(e.value)} className='song-chords-inplace'>
            <InplaceDisplay>
                <Button
                    className='p-button-text'
                    label={t('common.show_chords')}
                    icon='pi pi-angle-down'
                    iconPos='right'
                />
            </InplaceDisplay>
            <InplaceContent>
                <Button
                    className='p-button-text'
                    label={t('common.hide_chords')}
                    icon='pi pi-angle-up'
                    iconPos='right'
                    onClick={() => setChordsActive(!chordsActive)}
                />
                <ChordsDiagrams />
            </InplaceContent>
        </Inplace>
    );
};

export default React.memo(SongChordDiagrams);
