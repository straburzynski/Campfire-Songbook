import React, { useContext, useEffect } from 'react';
import LyricsComponent from '../lyrics/LyricsComponent';
import { SongModel } from '../../model/SongModel';
import { DEBUG, SOCKET_URL, TOPICS } from '../../config/WebSocketConfig';
import SockJsClient from 'react-stomp';
import AppContext from '../../context/AppContext';
import API from '../../config/ApiConfig';
import { SessionModel } from '../../model/SessionModel';

export default function Join(props) {

    // const [song, setSong] = useState<SongModel | undefined>(undefined)

    const appContext = useContext(AppContext);

    useEffect(() => {
        console.log('join - use effect fire');
        if (props.sessionName != null) {
            // get db session
            getSession(props.sessionName)
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getSession = async (sessionName: string) => {
        API.get<SessionModel>(`sessions/${sessionName}`)
            .then(res => {
                const session: SessionModel = res.data;
                // setSession(session);
                appContext.changeSessionName(session.name)
                appContext.changeSongId(session.songId)
            })
            .catch(err => {
                debugger;
                console.log('join error');
                console.log(err);
            })
        console.log('Join - downloaded session', appContext.sessionName, appContext.songId);
    }

    let onConnected = () => {
        console.log("Connected!!")
    }

    let onDisconnected = () => {
        console.log("Disconnected!!")
    }

    let onMessageReceived = (msg: SongModel) => {
        // setSong(msg);
        appContext.changeSongId(msg.id);
    }

    // const getSong = async () => {
    //     const response = await fetch(EnvConfig.url + "songs/efbbbf36-3230-3439-3563-652d30653230");
    //     const data = await response.json();
    //     console.log(data);
    //     setSong(data);
    // }

    return (
        <div>
            <pre>props session name{props.sessionName}</pre>
            <pre>context session name{appContext.sessionName}</pre>
            <pre>context song id {appContext.songId}</pre>
            <h2>Selected song</h2>
            <LyricsComponent/>

            <SockJsClient
                url={SOCKET_URL}
                topics={TOPICS}
                onConnect={onConnected}
                onDisconnect={onDisconnected}
                onMessage={msg => onMessageReceived(msg)}
                debug={DEBUG}
            />
        </div>
    );
}
