import React, { useContext, useEffect, useState } from 'react';
import { ANNOTATION, NEW_LINE, SEPARATOR, SIDE } from '../../config/ChordConfig';
import Chord from '../chord/Chord';
import AppContext from '../../context/AppContext';
import { SongModel } from '../../model/SongModel';
import { getSong } from '../../service/SongService';
import './lyrics.css';
import { ChordPositionEnum } from '../../model/ChordPosition';

const Lyrics = () => {
    const appContext = useContext(AppContext);
    const [song, setSong] = useState<SongModel>();

    useEffect(() => {
        if (appContext.songId) {
            console.log('song changed');
            handleGetSong(appContext.songId);
        }
    }, [appContext.songId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleGetSong = (songId: string): void => {
        getSong(songId).then((res) => {
            setSong(res);
            console.log('getSong:', res);
        });
    };

    const noSongSelected = () => {
        return <p>No song selected</p>;
    };

    const selectedSong = (song) => {
        return (
            <div>
                <h3 className="p-mb-4">{`${song.title} - ${song.author}`}</h3>
                <div className="lyrics">
                    {song.lyrics.split(NEW_LINE).map((line, i) => {
                        return (
                            <p key={i}>
                                {line.split(SEPARATOR).map((part, index) => {
                                    if (part.startsWith(ANNOTATION)) {
                                        return (
                                            <Chord
                                                key={i.toString() + index}
                                                chordName={part.substr(1)}
                                                chordPosition={ChordPositionEnum.ANNOTATION}
                                            />
                                        );
                                    } else if (part.startsWith(SIDE)) {
                                        return (
                                            <Chord
                                                key={i.toString() + index}
                                                chordName={part.substr(1)}
                                                chordPosition={ChordPositionEnum.SIDE}
                                            />
                                        );
                                    } else {
                                        return part;
                                    }
                                })}
                            </p>
                        );
                    })}
                </div>
            </div>
        );
    };

    return <div>{song ? selectedSong(song) : noSongSelected()}</div>;
};

export default Lyrics;
