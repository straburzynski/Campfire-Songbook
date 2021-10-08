import React from 'react';
import { AppContextModel } from '../model/AppContextModel';
import { InstrumentEnum } from '../model/InstrumentEnum';

const AppContext = React.createContext<AppContextModel>({
    song: undefined,
    sessionName: undefined,
    host: false,
    instrument: InstrumentEnum.GUITAR
});

export default AppContext;
