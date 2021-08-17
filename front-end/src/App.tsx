import React, { useState } from 'react';
import SockJsClient from 'react-stomp';
import { SongModel } from './model/SongModel';
import Chord from './components/Chord'
import './index.css'
import { DEBUG, SOCKET_URL, TOPICS } from './config/WebSocketConfig';
import { ANNOTATION, SEPARATOR } from './config/ChordConfig';
import SongList from './components/songList/SongList';
import LyricsComponent from './components/LyricsComponent';
import { Route, Switch } from "react-router-dom";
import Home from './components/home/Home';
import Host from './components/host/Host';
import NotFound from './components/notFound/NotFound';

const App = () => {
    const [song, setSong] = useState<SongModel | undefined>(undefined);

    const mockSong: SongModel = {
        id: 'a83f8a2c-4b7f-4120-beff-85aa2abdf695',
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

            <Home/>


            <Switch>
                <Route exact path="/"><Home/></Route>
                <Route exact path="/host/:sessionName" render={(props) => (
                    <Host sessionName={props.match.params.sessionName}/>
                )}/>
                <Route exact path="/join/:sessionName" render={(props) => (
                    <Host sessionName={props.match.params.sessionName}/>
                )}/>
                <Route path="/songs"><SongList/></Route>
                <Route path="*">
                    <NotFound/>
                </Route>
            </Switch>


            <hr/>
            <p>{mockSong?.author} {mockSong?.title}</p>
            <p>{
                mockSong?.lyrics.split(SEPARATOR).map((part, index) => {
                    if (part.startsWith(ANNOTATION)) {
                        return <Chord key={index} value={part.substr(1)}/>;
                    } else {
                        return part;
                    }
                })
            }</p>

            <hr/>
            <hr/>
            <LyricsComponent/>

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
};

export default App;
