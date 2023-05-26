import React from 'react';
import './index.scss';
import AppContext from './context/AppContext';
import Header from './components/header/Header';
import RouteComponent from './routing/RouteComponent';
import { ScrollTop } from 'primereact/scrolltop';
import { CreateAppContext } from './context/ContextConfig';
import { ToastContainer } from 'react-toastify';
import { ConfirmDialog } from 'primereact/confirmdialog';
import 'react-toastify/dist/ReactToastify.css';
import './translations/i18n';

const App = () => {
    return (
        <div>
            <ScrollTop />
            <AppContext.Provider value={CreateAppContext()}>
                <Header />
                <RouteComponent />
            </AppContext.Provider>
            <ToastContainer position="bottom-center" autoClose={5000} closeOnClick draggable={false} />
            <ConfirmDialog />
        </div>
    );
};

export default App;
