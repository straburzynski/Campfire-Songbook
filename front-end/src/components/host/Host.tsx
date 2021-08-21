import React, { useEffect, useState } from 'react';
import SongList from '../songList/SongList';
import { SongModel } from '../../model/SongModel';
import { SessionModel } from '../../model/SessionModel';
import LyricsComponent from '../LyricsComponent';
import API from '../../config/ApiConfig';

export default function Host(props) {

    const [session, setSession] = useState<SessionModel>()
    const [song, setSong] = useState<SongModel>()

    useEffect(() => {
        console.log('host use effect fire');
        if (props.sessionName != null) {
            // set session name to local storage
            console.log('saving sessionName', props.sessionName);
            localStorage.setItem("sessionName", props.sessionName);

            // get db session
            createSession(props.sessionName)

        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const createSession = async (sessionName: string) => {
        API.post('sessions/', {name: sessionName})
            .then(res => {
                const session: SessionModel = res.data;
                setSession(session);
                if (session.songId) {
                    getSong(session.songId);
                }
            })
            .catch(err => {
                console.log(err);
            })
        console.log('downloaded session', session);
    }

    const getSong = async (songId: string) => {
        API.get('songs/' + songId)
            .then(res => {
                const song = res.data;
                setSong(song);
                console.log('getSong:', song)
            })
    }

    return <>
        <pre>{props.sessionName}</pre>
        <h2>Select song</h2>
        <SongList/>
        <hr/>
        <h2>Selected song</h2>
        <pre>{song?.id}</pre>
        <LyricsComponent song={song}/>
    </>
}
