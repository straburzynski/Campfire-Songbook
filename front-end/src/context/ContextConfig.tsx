import { useState } from 'react';
import { InstrumentEnum } from '../model/InstrumentEnum';
import { SongModel } from '../model/SongModel';
import { getItemFromLocalStorage } from '../service/LocalStorageService';
import { DEFAULT_FONT_SIZE, DEFAULT_INSTRUMENT } from '../config/AppConfig';

export const CreateAppContext = () => {
    const [sessionName, setSessionName] = useState<string>();
    const [song, setSong] = useState<SongModel>();
    const [host, setHost] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(getFontSize);
    const [instrument, setInstrument] = useState<InstrumentEnum>(getInstrument);

    return {
        sessionName,
        setSessionName,
        song,
        setSong,
        host,
        setHost,
        instrument,
        setInstrument,
        fontSize,
        setFontSize,
    };
};

const getFontSize = (): number => {
    const fontSize = getItemFromLocalStorage('fontSize');
    return fontSize ? parseInt(fontSize) : DEFAULT_FONT_SIZE;
};

const getInstrument = (): InstrumentEnum => {
    const instrument = getItemFromLocalStorage('instrument');
    return instrument ? (`${instrument}` as InstrumentEnum) : DEFAULT_INSTRUMENT;
};
