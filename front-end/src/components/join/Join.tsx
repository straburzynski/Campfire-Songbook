import React, { useContext, useEffect, useRef } from 'react';
import Lyrics from '../lyrics/Lyrics';
import { useHistory, useParams } from 'react-router-dom';
import { DEBUG, SOCKET_URL, TOPIC } from '../../config/WebSocketConfig';
import SockJsClient from 'react-stomp';
import AppContext from '../../context/AppContext';
import { getSession } from '../../service/SessionService';
import { SongModel } from '../../model/SongModel';
import { toastConfig } from '../../config/ToastConfig';

export default function Join() {
    let { sessionName } = useParams();
    let history = useHistory();
    const appContext = useContext(AppContext);

    const toast = useRef<any>(null);

    const showToast = () => {
        toast.current.show(toastConfig('warn', 'Session not found'));
    };

    useEffect(() => {
        if (appContext.sessionName == null) {
            appContext.changeHost(false);
            checkSession(sessionName);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    let onConnected = () => {
        console.log('Connected!!');
    };

    let onDisconnected = () => {
        console.log('Disconnected!!');
    };

    const saveSessionNameToLocalStorage = (sessionName): void => {
        localStorage.setItem('sessionName', sessionName);
    };

    const checkSession = (sessionName: string): void => {
        console.log('check session: ', sessionName);
        getSession(sessionName)
            .then((res) => {
                appContext.changeSessionName(res.name);
                appContext.changeSong(res.song);
                saveSessionNameToLocalStorage(sessionName);
            })
            .catch((err) => {
                history.push('/');
                console.log(err);
                showToast();
            });
    };

    let onMessageReceived = (msg: SongModel) => {
        appContext.changeSong(msg);
    };

    return (
        <div className="p-p-2">
            <Lyrics song={appContext.song} />
            {appContext.sessionName && (
                <SockJsClient
                    url={SOCKET_URL}
                    topics={[TOPIC + appContext.sessionName]}
                    onConnect={onConnected}
                    onDisconnect={onDisconnected}
                    onMessage={(msg) => onMessageReceived(msg)}
                    debug={DEBUG}
                />
            )}
        </div>
    );
}
