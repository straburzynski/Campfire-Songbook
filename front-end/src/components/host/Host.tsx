import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Lyrics from '../lyrics/Lyrics';
import AppContext from '../../context/AppContext';
import { createSession } from '../../service/SessionService';
import { SessionModel } from '../../model/SessionModel';

export default function Host() {
    let { sessionName } = useParams();
    const appContext = useContext(AppContext);

    useEffect(() => {
        const handleHostSession = (sessionName: string): void => {
            createSession(sessionName)
                .then((res: SessionModel) => {
                    appContext.changeSessionName(res.name);
                    appContext.changeSong(res.song);
                    appContext.changeHost(true);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        if (sessionName != null) {
            handleHostSession(sessionName);
        }
    }, [appContext, sessionName]);

    return (
        <div className="p-p-2">
            <Lyrics song={appContext.song} />
        </div>
    );
}
