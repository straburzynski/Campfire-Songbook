import { useState } from 'react';
import { InstrumentEnum } from '../model/InstrumentEnum';
import { SongModel } from '../model/SongModel';
import { getItemFromLocalStorage } from '../service/LocalStorageService';
import {
    DEFAULT_AUTO_COLUMNS_ON,
    DEFAULT_COLUMNS_COUNT,
    DEFAULT_FONT_SIZE,
    DEFAULT_INSTRUMENT,
} from '../config/AppConfig';

export const CreateAppContext = () => {
    const [sessionName, setSessionName] = useState<string>();
    const [song, setSong] = useState<SongModel>();
    const [host, setHost] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(getFontSize);
    const [instrument, setInstrument] = useState<InstrumentEnum>(getInstrument);
    const [autoColumnsOn, setAutoColumnsOn] = useState<boolean>(getAutoColumnsOn);
    const [columnsCount, setColumnsCount] = useState<number>(getColumnsCount);

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
        autoColumnsOn,
        setAutoColumnsOn,
        columnsCount,
        setColumnsCount,
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

const getAutoColumnsOn = (): boolean => {
    const autoColumnsOn = getItemFromLocalStorage('autoColumnsOn');
    return autoColumnsOn ? autoColumnsOn == 'true' : DEFAULT_AUTO_COLUMNS_ON;
};

const getColumnsCount = (): number => {
    const columnsCount = getItemFromLocalStorage('columnsCount');
    return columnsCount ? parseInt(columnsCount) || DEFAULT_COLUMNS_COUNT : DEFAULT_COLUMNS_COUNT;
};
