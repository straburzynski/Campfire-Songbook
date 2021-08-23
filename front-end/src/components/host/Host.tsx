import React, { useContext, useEffect, useState } from 'react';
import SongList from '../songList/SongList';
import { SessionModel } from '../../model/SessionModel';
import LyricsComponent from '../lyrics/LyricsComponent';
import API from '../../config/ApiConfig';
import AppContext from '../../context/AppContext';

export default function Host(props) {

    const [session, setSession] = useState<SessionModel>()
    const appContext = useContext(AppContext);

    useEffect(() => {
        console.log('host - use effect fire');
        if (props.sessionName != null) {
            createSession(props.sessionName)
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const createSession = async (sessionName: string) => {
        API.post('sessions/', {name: sessionName})
            .then(res => {
                const session: SessionModel = res.data;
                setSession(session);
                appContext.changeSessionName(session.name)
                appContext.changeSongId(session.songId)
            })
            .catch(err => {
                console.log(err);
            })
        console.log('downloaded session', session);
    }

    // const getSong = async (songId: string) => {
    //     API.get('songs/' + songId)
    //         .then(res => {
    //             const song = res.data;
    //             setSong(song);
    //             console.log('getSong:', song)
    //         })
    // }

    return (
        <>
            <hr/>
            <pre>session name: {appContext?.sessionName}</pre>
            <pre>song id: {appContext?.songId}</pre>
            <hr/>
            <pre>{props.sessionName}</pre>
            <h2>Select song</h2>
            <SongList session={session}/>
            <hr/>
            <h2>Selected song</h2>
            {/*<pre>{song?.id}</pre>*/}
            <LyricsComponent/>
        </>
    )
}
