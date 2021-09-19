import React, { useContext, useEffect } from 'react';
import Lyrics from '../shared/lyrics/Lyrics';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DEBUG, SOCKET_URL, TOPIC } from '../../config/WebSocketConfig';
import SockJsClient from 'react-stomp';
import AppContext from '../../context/AppContext';
import { getSession } from '../../service/SessionService';
import { SongModel } from '../../model/SongModel';
import { toast } from 'react-toastify';

export default function Join() {
    let { sessionName } = useParams();
    let history = useHistory();
    const location = useLocation();
    const { setHost, setSessionName, song, setSong } = useContext(AppContext);

    useEffect(() => {
        if (!location?.state?.authorized) {
            getSession(sessionName)
                .then((res) => {
                    setSessionName(res.name);
                    setSong(res.song);
                    setHost(false);
                    saveSessionNameToLocalStorage(sessionName);
                })
                .catch((err) => {
                    history.push('/');
                    console.log(err);
                    toast.error('Session not found');
                });
        }
    }, [history, location, sessionName, setHost, setSong, setSessionName]);

    let onConnected = () => {
        console.log('Connected!!');
    };

    let onDisconnected = () => {
        console.log('Disconnected!!');
    };

    const saveSessionNameToLocalStorage = (sessionName): void => {
        localStorage.setItem('sessionName', sessionName);
    };

    let onMessageReceived = (msg: SongModel) => {
        setSong(msg);
    };

    return (
        <div className="p-p-2">
            <Lyrics song={song} />
            {sessionName && (
                <SockJsClient
                    url={SOCKET_URL}
                    topics={[TOPIC + sessionName]}
                    onConnect={onConnected}
                    onDisconnect={onDisconnected}
                    onMessage={(msg) => onMessageReceived(msg)}
                    debug={DEBUG}
                />
            )}
        </div>
    );
}
