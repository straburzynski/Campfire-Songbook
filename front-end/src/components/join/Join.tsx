import React, { useContext, useEffect } from 'react';
import Lyrics from '../lyrics/Lyrics';
import { useHistory, useParams } from 'react-router-dom';
import { DEBUG, SOCKET_URL, TOPIC } from '../../config/WebSocketConfig';
import SockJsClient from 'react-stomp';
import AppContext from '../../context/AppContext';
import { getSession } from '../../service/SessionService';

export default function Join() {
    let { sessionName } = useParams();
    let history = useHistory();
    const appContext = useContext(AppContext);

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
        console.log('saving sessionName', sessionName);
        localStorage.setItem('sessionName', sessionName);
    };

    const checkSession = (sessionName: string): void => {
        getSession(sessionName)
            .then((res) => {
                appContext.changeSessionName(res.name);
                appContext.changeSongId(res.songId);
                saveSessionNameToLocalStorage(sessionName);
            })
            .catch((err) => {
                history.push('/');
                console.log(err);
                alert('no session found');
            });
    };

    let onMessageReceived = (msg) => {
        console.log('received song', msg);
        appContext.changeSongId(msg);
    };

    const WebSocketClient = () => {
        if (appContext.sessionName != null) {
            const topics = [TOPIC + appContext.sessionName];
            return (
                <SockJsClient
                    url={SOCKET_URL}
                    topics={topics}
                    onConnect={onConnected}
                    onDisconnect={onDisconnected}
                    onMessage={(msg) => onMessageReceived(msg)}
                    debug={DEBUG}
                />
            );
        } else {
            return null;
        }
    };

    return (
        <div className="p-p-2">
            <Lyrics />
            <WebSocketClient />
        </div>
    );
}
