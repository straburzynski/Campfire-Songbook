import React from 'react';
import { ANNOTATION, NEW_LINE, SEPARATOR, SIDE } from '../../../config/ChordConfig';
import ChordName from './chordname/ChordName';
import { SongModel } from '../../../model/SongModel';
import { ChordPositionEnum } from '../../../model/ChordPosition';
import './lyrics.css';

const Lyrics = ({ song }) => {
    const renderPart = (part: string, lineIndex: number, partIndex) => {
        if (part.startsWith(ANNOTATION)) {
            return (
                <ChordName
                    key={lineIndex.toString() + partIndex}
                    chordId={lineIndex.toString() + partIndex}
                    chordName={part.substr(1)}
                    chordPosition={ChordPositionEnum.ANNOTATION}
                />
            );
        } else if (part.startsWith(SIDE)) {
            return (
                <ChordName
                    key={lineIndex.toString() + partIndex}
                    chordId={lineIndex.toString() + partIndex}
                    chordName={part.substr(1)}
                    chordPosition={ChordPositionEnum.SIDE}
                />
            );
        } else {
            return part;
        }
    };

    const SelectedSong = (song: SongModel) => {
        return (
            <div>
                <h3 className="p-mb-5">{`${song.author} - ${song.title}`}</h3>
                <div className="lyrics">
                    {song.lyrics.split(NEW_LINE).map((line, lineIndex) => {
                        return (
                            <p key={lineIndex}>
                                {line.split(SEPARATOR).map((part, partIndex) => renderPart(part, lineIndex, partIndex))}
                            </p>
                        );
                    })}
                </div>
            </div>
        );
    };

    return <>{song && SelectedSong(song)}</>;
};

export default React.memo(Lyrics);
