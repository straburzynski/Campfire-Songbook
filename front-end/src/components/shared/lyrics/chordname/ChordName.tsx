import React, { useContext, useState } from 'react';
import './chordName.css';
import { Dialog } from 'primereact/dialog';
import { getChord, getChordName, getChordPositions } from '../../../../service/ChordParserService';
import Chord from '@tombatossals/react-chords/lib/Chord';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import instruments from '../../../../resources/chords/instruments.json';
import AppContext from '../../../../context/AppContext';

const ChordName = ({ chordId, chordName, chordPosition, transposition }) => {
    const [chordDialog, setChordDialog] = useState<boolean>(false);
    const [chordDiagrams, setChordDiagrams] = useState([]);
    const [currentChordIndex, setCurrentChordIndex] = useState<number>(0);
    const { instrument } = useContext(AppContext);
    const { t } = useTranslation();

    const onChordClick = (e): void => {
        e.stopPropagation();
        const chords = getChordPositions(instrument!, getChord(chordName, transposition));
        setChordDiagrams(chords);
        setCurrentChordIndex(0);
        setChordDialog(true);
    };

    const handlePrev = (): void => {
        if (currentChordIndex > 0) {
            setCurrentChordIndex(currentChordIndex - 1);
        }
    };
    const handleNext = (): void => {
        if (currentChordIndex < chordDiagrams.length - 1) {
            setCurrentChordIndex(currentChordIndex + 1);
        }
    };

    return (
        <>
            <span onClick={onChordClick} className={`chord-name-text ${chordPosition} id-${chordId}`}>
                {getChordName(chordName, transposition)}
            </span>

            <Dialog
                className="chord-name-dialog"
                visible={chordDialog}
                onHide={() => setChordDialog(false)}
                breakpoints={{ '960px': '40vw', '720px': '50vw', '640px': '80vw' }}
                style={{ width: '30vw' }}
                dismissableMask={true}
                blockScroll={true}
            >
                <div className="flex p-ai-center justify-content-center flex-column">
                    <h2>{getChordName(chordName, transposition)}</h2>
                    {chordDiagrams ? (
                        <>
                            <Chord chord={chordDiagrams[currentChordIndex]} instrument={instruments[instrument!]} />
                            <div className="flex-item mt-2 align-self-center">
                                <Button
                                    onClick={handlePrev}
                                    icon="pi pi-arrow-left"
                                    className={`button-secondary mx-4 ${currentChordIndex === 0 && 'button-text'}`}
                                />
                                <Button
                                    onClick={handleNext}
                                    icon="pi pi-arrow-right"
                                    className={`button-secondary mx-4 ${
                                        currentChordIndex === chordDiagrams.length - 1 && 'button-text'
                                    }`}
                                />
                            </div>
                        </>
                    ) : (
                        <div>{t('exception.chord_not_found')}</div>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default ChordName;
