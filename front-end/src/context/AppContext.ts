import React from 'react';
import { AppContextModel } from '../model/AppContextModel';

const AppContext = React.createContext<AppContextModel>({
    song: undefined,
    sessionName: undefined,
    host: false,
    showChords: true,
});

export default AppContext;
