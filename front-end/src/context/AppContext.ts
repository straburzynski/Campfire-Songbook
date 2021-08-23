import React from 'react';
import { AppContextModel } from '../model/AppContextModel';

const AppContext = React.createContext<AppContextModel>({
    sessionName: undefined,
    changeSessionName: () => {},
    songId: undefined,
    changeSongId: () => {}
});

export default AppContext;
