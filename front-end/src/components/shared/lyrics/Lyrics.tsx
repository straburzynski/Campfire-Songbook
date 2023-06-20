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
import AutoScroll from '../scroller/AutoScroll';

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
                                label={t('common.show_options')}
                                icon='pi pi-angle-down'
                                iconPos='right'
                            />
                        </InplaceDisplay>
                        <InplaceContent>
                            <Button
                                text
                                severity='secondary'
                                label={t('common.hide_options')}
                                icon='pi pi-angle-up'
                                iconPos='right'
                                onClick={() => setTranspositionActive(!transpositionActive)}
                            />
                            <div className='mt-0 mb-2 mx-2 flex justify-content-center flex-wrap'>
                               <div className='p-buttonset flex align-items-center justify-content-center'>
                                   <Button
                                       severity='secondary'
                                       onClick={handleMinus}
                                       icon='pi pi-chevron-down'
                                       outlined
                                   />
                                   <Button
                                       severity='secondary'
                                       onClick={handleReset}
                                       label={t('common.transposition') + ': ' + transposition.toString()}
                                       outlined
                                   />
                                   <Button
                                       severity='secondary'
                                       onClick={handlePlus}
                                       icon='pi pi-chevron-up'
                                       outlined
                                       className='mr-3'
                                   />
                               </div>
                                <AutoScroll />
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
