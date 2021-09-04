import React from 'react';
import { AppContextModel } from '../model/AppContextModel';

const AppContext = React.createContext<AppContextModel>({
    sessionName: undefined,
    changeSessionName: () => {},
    song: undefined,
    changeSong: () => {},
    host: false,
    changeHost: () => {},
    showChords: true,
    changeShowChords: () => {},
});

export default AppContext;
