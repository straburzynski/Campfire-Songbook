import { useTranslation } from 'react-i18next';
import { getMultipleChordPositions } from '../../../service/ChordParserService';
import instruments from '../../../resources/chords/instruments.json';
import React, { useContext, useState } from 'react';
import { Inplace, InplaceContent, InplaceDisplay } from 'primereact/inplace';
import { Button } from 'primereact/button';
import Chord from '@tombatossals/react-chords/lib/Chord';
import { ANNOTATION, NEW_LINE, SEPARATOR, SIDE } from '../../../config/ChordConfig';
import './songChordDiagrams.scss';
import AppContext from '../../../context/AppContext';

const SongChordDiagrams = ({ lyrics }) => {
    const [chordsActive, setChordsActive] = useState(false);
    const { instrument } = useContext(AppContext);
    const { t } = useTranslation();

    const GetChords = () => {
        let songChords = new Set<string>();

        lyrics.split(NEW_LINE).forEach((line: string) => {
            line.split(SEPARATOR).forEach((part: string) => {
                if (part.startsWith(ANNOTATION)) {
                    songChords.add(part.substr(1));
                } else if (part.startsWith(SIDE)) {
                    songChords.add(part.substr(1));
                }
            });
        });
        const chordList: string[] = Array.from(songChords);
        const multipleChordPositions = getMultipleChordPositions(instrument, chordList);
        return (
            <div className="p-d-flex p-flex-row p-flex-wrap p-justify-center">
                {multipleChordPositions.map((chord, index) => {
                    return chord ? (
                        <div key={index} className="chord-container p-d-flex p-flex-column p-ai-center p-jc-center">
                            <h2>{chordList[index]}</h2>
                            <Chord key={index} chord={chord[0]} instrument={instruments[instrument]} />
                        </div>
                    ) : null;
                })}
            </div>
        );
    };

    return (
        <Inplace active={chordsActive} onToggle={(e) => setChordsActive(e.value)} className="song-chords-inplace">
            <InplaceDisplay>
                <Button
                    className="p-button-text"
                    label={t('common.showChords')}
                    icon="pi pi-angle-down"
                    iconPos="right"
                />
            </InplaceDisplay>
            <InplaceContent>
                <Button
                    className="p-button-text"
                    label={t('common.hideChords')}
                    icon="pi pi-angle-up"
                    iconPos="right"
                    onClick={() => setChordsActive(!chordsActive)}
                />
                <GetChords />
            </InplaceContent>
        </Inplace>
    );
};

export default React.memo(SongChordDiagrams);
