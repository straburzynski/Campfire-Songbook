import { useState } from 'react';
import { InstrumentEnum } from '../model/InstrumentEnum';
import { SongModel } from '../model/SongModel';

export const CreateAppContext = () => {
    const [sessionName, setSessionName] = useState<string>();
    const [song, setSong] = useState<SongModel>();
    const [host, setHost] = useState<boolean>(false);
    const [instrument, setInstrument] = useState<InstrumentEnum>(InstrumentEnum.GUITAR);

    return {
        sessionName,
        setSessionName,
        song,
        setSong,
        host,
        setHost,
        instrument,
        setInstrument,
    };
};
