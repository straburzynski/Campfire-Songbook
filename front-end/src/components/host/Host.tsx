import React, { useContext, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Lyrics from '../shared/lyrics/Lyrics';
import AppContext from '../../context/AppContext';
import { createSession } from '../../service/SessionService';
import { SessionModel } from '../../model/SessionModel';
import { toast } from 'react-toastify';

export default function Host() {
    let { sessionName } = useParams();
    let history = useHistory();
    const location = useLocation();
    const { setSessionName, song, setSong, setHost } = useContext(AppContext);

    useEffect(() => {
        const handleHostSession = (sessionName: string): void => {
            const password = location?.state?.password;
            createSession(sessionName, password)
                .then((res: SessionModel) => {
                    setSessionName(res.name);
                    setSong(res.song);
                    setHost(true);
                })
                .catch((err) => {
                    history.push('/');
                    console.log(err);
                    toast.error('Not authorized to session');
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
