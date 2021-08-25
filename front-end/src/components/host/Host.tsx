import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SongList from '../songList/SongList';
import { SessionModel } from '../../model/SessionModel';
import LyricsComponent from '../lyrics/LyricsComponent';
import AppContext from '../../context/AppContext';
import { createSession } from '../../service/SessionService';

export default function Host() {
    let { sessionName } = useParams();
    const [session, setSession] = useState<SessionModel>();
    const appContext = useContext(AppContext);

    useEffect(() => {
        if (sessionName != null) {
            handleHostSession(sessionName);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleHostSession = (sessionName: string): void => {
        createSession(sessionName)
            .then((res) => {
                setSession(session);
                appContext.changeSessionName(res.name);
                appContext.changeSongId(res.songId);
            })
            .catch((err) => {
                console.log(err);
            });
        console.log('downloaded session', session);
    };

    return (
        <>
            <pre>session name: {appContext?.sessionName}</pre>
            <h2>Select song</h2>
            <SongList session={session} />
            <hr />
            <LyricsComponent />
        </>
    );
}
