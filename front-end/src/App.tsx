import React, { useContext, useState } from 'react';
import './index.css'
import AppContext from './context/AppContext';
import Header from './components/header/Header';
import RouteComponent from './routing/RouteComponent';

const App = () => {

    const appContext = useContext(AppContext);
    const [sessionName, setSessionName] = useState(appContext.sessionName);
    const changeSessionName = (newValue) => setSessionName(newValue);
    const [songId, setSongId] = useState(appContext.songId);
    const changeSongId = (songId) => setSongId(songId);

    return (
        <div>
            <AppContext.Provider value={{sessionName, changeSessionName, songId, changeSongId}}>
                <Header/>
                <RouteComponent/>
            </AppContext.Provider>
        </div>
    );
};

export default App;
