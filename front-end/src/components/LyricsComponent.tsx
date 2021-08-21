import React from 'react';
import '../index.css'
import { ANNOTATION, NEW_LINE, SEPARATOR } from '../config/ChordConfig';
import Chord from './Chord';

const LyricsComponent = (props) => {

    const noSongSelected = () => {
        return <p>No song selected</p>
    }

    const selectedSong = (song) => {
        return <div>
            <h3>{song.title + ' ' + song.author}</h3>
            <div>
                {song.lyrics.split(NEW_LINE).map((line, i) => {
                    return <p key={i}> {
                        line.split(SEPARATOR).map((part, index) => {
                            if (part.startsWith(ANNOTATION)) {
                                return <Chord key={i.toString() + index} value={part.substr(1)}/>;
                            } else {
                                return part;
                            }
                        })
                    } </p>
                })
                }
            </div>

        </div>
    }

    return <div>
        {props.song ? selectedSong(props.song) : noSongSelected()}
    </div>

};

export default LyricsComponent
