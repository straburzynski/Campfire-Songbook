import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SongList from '../songList/SongList';
import { SessionModel } from '../../model/SessionModel';
import LyricsComponent from '../lyrics/LyricsComponent';
import API from '../../config/ApiConfig';
import AppContext from '../../context/AppContext';

export default function Host() {
    let { sessionName } = useParams();
    const [session, setSession] = useState<SessionModel>();
    const appContext = useContext(AppContext);

    useEffect(() => {
        if (sessionName != null) {
            createSession(sessionName);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const createSession = async (sessionName: string) => {
        API.post('sessions/', { name: sessionName })
            .then((res) => {
                const session: SessionModel = res.data;
                setSession(session);
                appContext.changeSessionName(session.name);
                appContext.changeSongId(session.songId);
            })
            .catch((err) => {
                console.log(err);
            });
        console.log('downloaded session', session);
    };

    return (
        <>
            <hr />
            <pre>session name: {appContext?.sessionName}</pre>
            <pre>song id: {appContext?.songId}</pre>
            <h2>Select song</h2>
            <SongList session={session} />
            <hr />
            <h2>Selected song</h2>
            <LyricsComponent />
        </>
    );
}
