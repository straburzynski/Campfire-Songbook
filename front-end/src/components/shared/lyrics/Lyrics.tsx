import React, { useContext, useState } from 'react';
import { ANNOTATION, NEW_LINE, SEPARATOR, SIDE } from '../../../config/ChordConfig';
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

const Lyrics = ({ song, showChordDiagrams = false }) => {
    const { fontSize } = useContext(AppContext);
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

    const chordsRow = (line: string): boolean => {
        const elements = line.split(/\s/);
        const spaces = elements.filter(value => value === '').length;
        const words = elements.filter(value => value !== '').length;
        return spaces > words;
    };
    const renderChordsWithLyric = (part: string, lineIndex: number, partIndex) => {
        if (part.startsWith(ANNOTATION)) {
            return (
                <ChordName
                    key={lineIndex.toString() + partIndex}
                    chordId={lineIndex.toString() + partIndex}
                    chordName={part.substring(1)}
                    chordPosition={ChordPositionEnum.ANNOTATION}
                    transposition={transposition}
                />
            );
        } else if (part.startsWith(SIDE)) {
            return (
                <ChordName
                    key={lineIndex.toString() + partIndex}
                    chordId={lineIndex.toString() + partIndex}
                    chordName={part.substring(1)}
                    chordPosition={ChordPositionEnum.SIDE}
                    transposition={transposition}
                />
            );
        } else {
            return part;
        }
    };

    const renderChordsRow = (part: string, lineIndex: number, partIndex) => {
        if (part === '') return ' ';
        const chord: ChordModel = Chord.get(part);
        if (chord.empty) {
            return part;
        } else {
            return (
                <ChordName
                    key={lineIndex.toString() + partIndex}
                    chordId={lineIndex.toString() + partIndex}
                    chordName={part}
                    chordPosition={ChordPositionEnum.SIDE}
                    transposition={transposition}
                />
            );
        }
    };

    const SelectedSong = (song: SongModel) => {
        return (
            <div>
                <h3 className='p-mb-5'>{`${song.author} - ${song.title}`}</h3>
                <div className='lyrics' style={{ fontSize: fontSize + 'px' }}>
                    {song.lyrics.split(NEW_LINE).map((line, lineIndex) => {
                        if (chordsRow(line)) {
                            return (
                                <p className='chords' key={lineIndex}>
                                    {line.split(/\s/).map((part, partIndex) => renderChordsRow(part, lineIndex, partIndex))}
                                </p>
                            );
                        } else {
                            return (
                                <p key={lineIndex}>
                                    {line.split(SEPARATOR).map((part, partIndex) => renderChordsWithLyric(part, lineIndex, partIndex))}
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
                        className='song-transposition-inplace'
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
            {song && SelectedSong(song)}
        </>
    );
};

export default React.memo(Lyrics);
