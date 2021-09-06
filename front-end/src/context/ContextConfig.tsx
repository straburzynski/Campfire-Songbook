import { useState } from 'react';

export const CreateAppContext = () => {
    const [sessionName, setSessionName] = useState();
    const [song, setSong] = useState();
    const [host, setHost] = useState();
    const [showChords, setShowChords] = useState();

    return {
        sessionName,
        setSessionName,
        song,
        setSong,
        host,
        setHost,
        showChords,
        setShowChords,
    };
};
