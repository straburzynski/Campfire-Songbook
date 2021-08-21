import React, { useEffect, useState } from 'react';
import LyricsComponent from '../LyricsComponent';
import { SongModel } from '../../model/SongModel';
import EnvConfig from '../../config/EnvConfig';
import { DEBUG, SOCKET_URL, TOPICS } from '../../config/WebSocketConfig';
import SockJsClient from 'react-stomp';

export default function Join(props) {

    const [song, setSong] = useState<SongModel | undefined>(undefined)

    useEffect(() => {
        console.log('useEffect fire');
        getSong();
    }, [])


    let onConnected = () => {
        console.log("Connected!!")
    }

    let onDisconnected = () => {
        console.log("Disconnected!!")
    }

    let onMessageReceived = (msg: SongModel) => {
        setSong(msg);
    }

    const getSong = async () => {
        const response = await fetch(EnvConfig.url + "songs/efbbbf36-3230-3439-3563-652d30653230");
        const data = await response.json();
        console.log(data);
        setSong(data);
    }

    return <div>
        <pre>{props.sessionName}</pre>
        <h2>Selected song</h2>
        <p>lyrics with chords</p>
        <LyricsComponent song={song}/>

        <SockJsClient
            url={SOCKET_URL}
            topics={TOPICS}
            onConnect={onConnected}
            onDisconnect={onDisconnected}
            onMessage={msg => onMessageReceived(msg)}
            debug={DEBUG}
        />
    </div>;
}
