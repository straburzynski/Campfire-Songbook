import React, { useContext, useEffect } from 'react';
import Lyrics from '../shared/lyrics/Lyrics';
import { useHistory, useParams } from 'react-router-dom';
import { DEBUG, SOCKET_URL, TOPIC } from '../../config/WebSocketConfig';
import SockJsClient from 'react-stomp';
import AppContext from '../../context/AppContext';
import { getSession } from '../../service/SessionService';
import { SongModel } from '../../model/SongModel';
import { toast } from 'react-toastify';
import SelectSong from '../shared/selectSong/SelectSong';
import { saveItemToLocalStorage } from '../../service/LocalStorageService';
import { useTranslation } from 'react-i18next';
import { CustomExceptionModel } from '../../model/CustomExceptionModel';
import { handleError } from '../../service/ExceptionService';

export default function Join() {
    let { sessionName: sessionNameFromUrl } = useParams();
    let history = useHistory();
    const { t } = useTranslation();
    const { host, setHost, sessionName, setSessionName, song, setSong } = useContext(AppContext);

    useEffect(() => {
        if (sessionName) {
            return;
        }
        getSession(sessionNameFromUrl)
            .then((res) => {
                setSessionName(res.name);
                setSong(res.song);
                setHost(false);
                saveItemToLocalStorage('sessionName', res.name);
            })
            .catch((err) => {
                history.push('/');
                const ex = err.response?.data as CustomExceptionModel;
                if (ex.params.hasOwnProperty('name')) {
                    toast.warning(t(ex.translationKey, { name: ex.params['name'] }));
                } else {
                    handleError(err);
                }
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    let onConnected = () => {
        console.log('Connected!!');
    };

    let onDisconnected = () => {
        console.log('Disconnected!!');
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
            <SelectSong song={song} host={host} />
        </div>
    );
}
