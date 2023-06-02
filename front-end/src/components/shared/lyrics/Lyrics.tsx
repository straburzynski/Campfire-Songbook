import React, { useContext, useEffect, useState } from 'react';
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
import { APP_NAME } from '../../../config/AppConfig';

const Lyrics = ({ song, showChordDiagrams = false }) => {
    const { fontSize, columnsCount, autoColumnsOn } = useContext(AppContext);
    const [transpositionActive, setTranspositionActive] = useState(false);
    const [transposition, setTransposition] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        if (transposition !== 0) {
            setTransposition(0);
        }
        const currentSong = song ? ` | ${song?.title} - ${song?.author}` : ''
        document.title = APP_NAME + currentSong;
        return () => {
            document.title = APP_NAME
        }
    }, [song]); // eslint-disable-line react-hooks/exhaustive-deps

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
                <h3 className='mb-5'>{`${song.author} - ${song.title}`}</h3>
                <div className='lyrics' style={{ fontSize: fontSize + 'px' }}>
                    {song.lyrics?.split(NEW_LINE).map((row, rowIndex) => {
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
                                text
                                severity='secondary'
                                label={t('common.show_transposition')}
                                icon='pi pi-angle-down'
                                iconPos='right'
                            />
                        </InplaceDisplay>
                        <InplaceContent>
                            <Button
                                text
                                severity='secondary'
                                label={t('common.hide_transposition')}
                                icon='pi pi-angle-up'
                                iconPos='right'
                                onClick={() => setTranspositionActive(!transpositionActive)}
                            />
                            <div className='flex-item mt-0 align-self-center'>
                                <Button
                                    text
                                    severity='secondary'
                                    onClick={handleMinus}
                                    className='mx-4'
                                    icon='pi pi-minus'
                                    iconPos='left'
                                />
                                <Button
                                    text
                                    severity='secondary'
                                    onClick={handleReset}
                                    className='mx-4'
                                    label={transposition.toString()}
                                />
                                <Button
                                    text
                                    severity='secondary'
                                    onClick={handlePlus}
                                    className='mx-4'
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
