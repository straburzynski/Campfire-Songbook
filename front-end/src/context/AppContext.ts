import React from 'react';
import { AppContextModel } from '../model/AppContextModel';

const AppContext = React.createContext<AppContextModel>({});

export default AppContext;
