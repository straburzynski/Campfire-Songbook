import React, { useState } from 'react';
import SockJsClient from 'react-stomp';
import { SongModel } from './model/SongModel';
import Chord from './components/Chord'
import './index.css'
import { DEBUG, SOCKET_URL, TOPICS } from './config/WebSocketConfig';
import { ANNOTATION, SEPARATOR } from './config/ChordConfig';

const App = () => {
    const [song, setSong] = useState<SongModel | undefined>(undefined);

    const mockSong: SongModel = {
        author: 'author',
        lyrics: 'First test test |@Am| test test test |@F#m| test test test test |@Am| test test test |@Fis| test test\n\n S|@Gm|econd test test test test test test T|@Gm|est test test test',
        title: 'title'
    }

    let onConnected = () => {
        console.log("Connected!!")
    }

    let onDisconnected = () => {
        console.log("Disconnected!!")
    }

    let onMessageReceived = (msg: SongModel) => {
        setSong(msg);
    }

    return (
        <div>
            <h2>Campfire Songs</h2>

            <hr/>
            <p>{mockSong?.author} {mockSong?.title}</p>
            <p> {
                mockSong?.lyrics.split(SEPARATOR).map(part => {
                    if (part.startsWith(ANNOTATION)) {
                        return <Chord value={part.substr(1)}/>;
                    } else {
                        return part;
                    }
                })
            }</p>

            <hr/>

            <SockJsClient
                url={SOCKET_URL}
                topics={TOPICS}
                onConnect={onConnected}
                onDisconnect={onDisconnected}
                onMessage={msg => onMessageReceived(msg)}
                debug={DEBUG}
            />
            <p>{song?.author}</p>
            <p>{song?.title}</p>
            <pre>{song?.lyrics}</pre>

        </div>
    );
}

export default App;
