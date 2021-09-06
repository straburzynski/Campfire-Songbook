import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Lyrics from '../shared/lyrics/Lyrics';
import AppContext from '../../context/AppContext';
import { createSession } from '../../service/SessionService';
import { SessionModel } from '../../model/SessionModel';

export default function Host() {
    let { sessionName } = useParams();
    const { setSessionName, song, setSong, setHost } = useContext(AppContext);

    useEffect(() => {
        const handleHostSession = (sessionName: string): void => {
            createSession(sessionName)
                .then((res: SessionModel) => {
                    setSessionName(res.name);
                    setSong(res.song);
                    setHost(true);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        if (sessionName != null) {
            handleHostSession(sessionName);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="p-p-2">
            <Lyrics song={song} />
        </div>
    );
}
