import React, { useContext, useState } from 'react';
import { ANNOTATION, NEW_LINE, SEPARATOR, SIDE, SPACE } from '../../../config/ChordConfig';
import ChordName from './chordname/ChordName';
import { SongModel } from '../../../model/SongModel';
import { ChordPositionEnum } from '../../../model/ChordPosition';
import SongChordDiagrams from '../songChordDiagrams/SongChordDiagrams';
import './lyrics.scss';
import AppContext from '../../../context/AppContext';
import { Button } from 'primereact/button';
import { Inplace, InplaceContent, InplaceDisplay } from 'primereact/inplace';
import { useTranslation } from 'react-i18next';
import { Chord } from 'tonal';
import { ChordModel } from '../../../model/ChordModel';
import { rowWithChordsOnlyDetected } from '../../../service/ChordParserService';

const Lyrics = ({ song, showChordDiagrams = false }) => {
    const { fontSize, columnsCount, autoColumnsOn } = useContext(AppContext);
    const [transpositionActive, setTranspositionActive] = useState(false);
    const [transposition, setTransposition] = useState(0);
    const { t } = useTranslation();

    const handlePlus = (): void => {
        setTransposition((prevState) => prevState + 1);
    };
    const handleMinus = (): void => {
        setTransposition((prevState) => prevState - 1);
    };
    const handleReset = (): void => {
        setTransposition(0);
    };

    const renderChordsWithLyric = (part: string, rowIndex: number, partIndex) => {
        if (part.startsWith(ANNOTATION)) {
            return (
                <ChordName
                    key={rowIndex.toString() + partIndex}
                    chordId={rowIndex.toString() + partIndex}
                    chordName={part.substring(1)}
                    chordPosition={ChordPositionEnum.ANNOTATION}
                    transposition={transposition}
                />
            );
        } else if (part.startsWith(SIDE)) {
            return (
                <ChordName
                    key={rowIndex.toString() + partIndex}
                    chordId={rowIndex.toString() + partIndex}
                    chordName={part.substring(1)}
                    chordPosition={ChordPositionEnum.SIDE}
                    transposition={transposition}
                />
            );
        } else {
            return part;
        }
    };

    const renderChordsRow = (part: string, rowIndex: number, partIndex) => {
        if (part === '') return ' ';
        const chord: ChordModel = Chord.get(part);
        if (chord.empty) {
            return part;
        } else {
            return (
                <ChordName
                    key={rowIndex.toString() + partIndex}
                    chordId={rowIndex.toString() + partIndex}
                    chordName={part}
                    chordPosition={ChordPositionEnum.SIDE}
                    transposition={transposition}
                />
            );
        }
    };

    const renderSelectedSong = (song: SongModel) => {
        return (
            <div className={autoColumnsOn ? 'auto-columns-on' : `lyrics-column-${columnsCount}`}>
                <h3 className='p-mb-5'>{`${song.author} - ${song.title}`}</h3>
                <div className='lyrics' style={{ fontSize: fontSize + 'px' }}>
                    {song.lyrics.split(NEW_LINE).map((row, rowIndex) => {
                        row = row.trimStart();
                        if (rowWithChordsOnlyDetected(row)) {
                            return (
                                <p className='chords' key={rowIndex}>
                                    {row
                                        .split(SPACE)
                                        .map((part, partIndex) => renderChordsRow(part, rowIndex, partIndex))}
                                </p>
                            );
                        } else {
                            return (
                                <p key={rowIndex}>
                                    {row
                                        .split(SEPARATOR)
                                        .map((part, partIndex) => renderChordsWithLyric(part, rowIndex, partIndex))}
                                </p>
                            );
                        }
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            {song && showChordDiagrams && (
                <>
                    <Inplace
                        active={transpositionActive}
                        onToggle={(e) => setTranspositionActive(e.value)}
                        className='song-transposition-inplace non-printable'
                    >
                        <InplaceDisplay>
                            <Button
                                className='p-button-text'
                                label={t('common.show_transposition')}
                                icon='pi pi-angle-down'
                                iconPos='right'
                            />
                        </InplaceDisplay>
                        <InplaceContent>
                            <Button
                                className='p-button-text'
                                label={t('common.hide_transposition')}
                                icon='pi pi-angle-up'
                                iconPos='right'
                                onClick={() => setTranspositionActive(!transpositionActive)}
                            />
                            <div className='flex-item p-mt-0 p-as-center'>
                                <Button
                                    onClick={handleMinus}
                                    className='p-button-text p-mx-4'
                                    icon='pi pi-minus'
                                    iconPos='left'
                                />
                                <Button
                                    onClick={handleReset}
                                    className='p-button-text p-mx-4'
                                    label={transposition.toString()}
                                />
                                <Button
                                    onClick={handlePlus}
                                    className='p-button-text p-mx-4'
                                    icon='pi pi-plus'
                                    iconPos='right'
                                />
                            </div>
                        </InplaceContent>
                    </Inplace>

                    <SongChordDiagrams lyrics={song.lyrics} transposition={transposition} />
                </>
            )}
            {song && renderSelectedSong(song)}
        </>
    );
};

export default React.memo(Lyrics);
