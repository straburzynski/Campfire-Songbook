import React, { useContext, useEffect, useState } from 'react';
import '../../index.css';
import { ANNOTATION, NEW_LINE, SEPARATOR } from '../../config/ChordConfig';
import Chord from '../chord/Chord';
import AppContext from '../../context/AppContext';
import { getSong } from '../../service/SongService';
import { SongModel } from '../../model/SongModel';

const LyricsComponent = () => {
    const appContext = useContext(AppContext);
    const [song, setSong] = useState<SongModel>();

    useEffect(() => {
        console.log('get song from lyrics component');
        const handleGetSong = (songId: string): void => {
            getSong(songId).then((res) => {
                setSong(res);
                console.log('getSong:', song);
            });
        };
        console.log('useEffect fire');
        if (appContext.songId) {
            handleGetSong(appContext.songId);
        }
    }, [appContext.songId]);

    const noSongSelected = () => {
        return <p>No song selected</p>;
    };

    const selectedSong = (song) => {
        return (
            <div>
                <h3>{`${song.title} - ${song.author}`}</h3>
                <div>
                    {song.lyrics.split(NEW_LINE).map((line, i) => {
                        return (
                            <p key={i}>
                                {line.split(SEPARATOR).map((part, index) => {
                                    if (part.startsWith(ANNOTATION)) {
                                        return <Chord key={i.toString() + index} value={part.substr(1)} />;
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

    return (
        <div>
            <pre>session name: {appContext?.sessionName}</pre>
            <pre>song id: {appContext?.songId}</pre>
            {song ? selectedSong(song) : noSongSelected()}
        </div>
    );
};

export default LyricsComponent
