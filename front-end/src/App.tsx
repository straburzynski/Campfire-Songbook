import React from 'react';
import './index.scss';
import AppContext from './context/AppContext';
import Header from './components/header/Header';
import RouteComponent from './routing/RouteComponent';
import { ScrollTop } from 'primereact/scrolltop';
import { CreateAppContext } from './context/ContextConfig';

const App = () => {
    return (
        <div>
            <ScrollTop />
            <AppContext.Provider value={CreateAppContext()}>
                <Header />
                <RouteComponent />
            </AppContext.Provider>
        </div>
    );
};

export default App;
