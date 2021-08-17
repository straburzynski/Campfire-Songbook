import React, { useEffect, useState } from 'react';
import '../index.css'
import { SongModel } from '../model/SongModel';
import { ANNOTATION, NEW_LINE, SEPARATOR } from '../config/ChordConfig';
import Chord from './Chord';

const LyricsComponent = () => {
    const [song, setSong] = useState<SongModel | undefined>(undefined)

    useEffect(() => {
        console.log('useEffect fire');
        // fetch("http://localhost:8080/songs")
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
        //         setSongs(data);
        //         // console.log(songs)
        //     })
        const getSong = async () => {
            // todo: env configuration
            const response = await fetch("http://localhost:8080/songs/efbbbf36-3230-3439-3563-652d30653230");
            const data = await response.json();
            console.log(data);
            setSong(data);
        }
        getSong();
    }, [])

    return <div>
        <h3>{song?.title + ' ' + song?.author}</h3>
        <div>
            {song?.lyrics.split(NEW_LINE).map((line, i) => {
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

        {/*<p>{*/}
        {/*    song?.lyrics.split(SEPARATOR).map((part, index) => {*/}
        {/*        if (part.startsWith(ANNOTATION)) {*/}
        {/*            return <Chord key={index} value={part.substr(1)}/>;*/}
        {/*        } else {*/}
        {/*            return part;*/}
        {/*        }*/}
        {/*    })*/}
        {/*}</p>*/}
    </div>

};

export default LyricsComponent
