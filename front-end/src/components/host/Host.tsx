import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import Lyrics from '../shared/lyrics/Lyrics';
import AppContext from '../../context/AppContext';
import { createSession } from '../../service/SessionService';
import { SessionModel } from '../../model/SessionModel';
import { toastConfig } from '../../config/ToastConfig';

export default function Host() {
    let { sessionName } = useParams();
    let history = useHistory();
    const location = useLocation();
    const { setSessionName, song, setSong, setHost } = useContext(AppContext);
    const toast = useRef<any>(null);

    const showToast = () => {
        toast?.current?.show(toastConfig('warn', 'Not authorized to session'));
    };

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
                    showToast();
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
