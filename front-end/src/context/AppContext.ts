import React from 'react';
import { AppContextModel } from '../model/AppContextModel';

const AppContext = React.createContext<AppContextModel>({
    sessionName: undefined,
    changeSessionName: () => {},
    songId: undefined,
    changeSongId: () => {},
    host: false,
    changeHost: () => {},
    showChords: true,
    changeShowChords: () => {},
});

export default AppContext;
