import { useContext, useState } from 'react';
import AppContext from './AppContext';

export const CreateAppContext = () => {
    const appContext = useContext(AppContext);
    const [sessionName, setSessionName] = useState(appContext.sessionName);
    const changeSessionName = (newValue) => setSessionName(newValue);
    const [song, setSong] = useState(appContext.song);
    const changeSong = (song) => setSong(song);
    const [host, setHost] = useState(appContext.host);
    const changeHost = (host) => setHost(host);
    const [showChords, setShowChords] = useState(appContext.showChords);
    const changeShowChords = (showChords) => setShowChords(showChords);

    return {
        sessionName,
        changeSessionName,
        song,
        changeSong,
        host,
        changeHost,
        showChords,
        changeShowChords,
    };
};
