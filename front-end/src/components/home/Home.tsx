import React, { useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { getSession } from '../../service/SessionService';
import AppContext from '../../context/AppContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AppContextModel } from '../../model/AppContextModel';
import { Toast } from 'primereact/toast';
import { toastConfig } from '../../config/ToastConfig';
import './home.scss';
import logo from '../../resources/logo.png';
import { SessionModel } from '../../model/SessionModel';

const Home = () => {
    let history = useHistory();
    const { setSong, sessionName, setSessionName } = useContext<AppContextModel>(AppContext);
    const toast = useRef<any>(null);

    useEffect(() => {
        const savedSessionName = localStorage.getItem('sessionName');
        if (savedSessionName) {
            setSessionName(savedSessionName);
        }
    }, [sessionName, setSessionName]);

    const showToast = (text: string): void => {
        toast.current.show(toastConfig('warn', text));
    };

    const saveSessionNameToLocalStorage = (sessionName): void => {
        localStorage.setItem('sessionName', sessionName);
    };

    const handleHostButton = (url: string): void => {
        if (sessionName == null || sessionName === '') {
            showToast('Enter session name');
        } else {
            saveSessionNameToLocalStorage(sessionName);
            history.push(`/${url}/${sessionName}`);
        }
    };

    const handleJoinButton = (): void => {
        if (sessionName == null || sessionName === '') {
            showToast('Enter session name');
        } else {
            checkSession(sessionName);
        }
    };

    const checkSession = (sessionName: string): void => {
        getSession(sessionName)
            .then((res: SessionModel) => {
                setSessionName(res.name);
                setSong(res.song);
                saveSessionNameToLocalStorage(sessionName);
                history.push(`/join/${sessionName}`);
            })
            .catch(() => {
                showToast('Session not found');
            });
    };

    const handleOnChange = (e): void => {
        setSessionName(e.target.value);
    };

    return (
        <div className="home">
            <div className="flex-container">
                <Toast ref={toast} position="bottom-center" />
                <div className="row">
                    <div className="flex-item p-mb-2">
                        <img src={logo} className="logo" alt="Campfire Songs Logo" />
                    </div>
                    <div className="flex-item p-mb-6 title">Campfire Songbook</div>
                    <div className="flex-item p-mb-6">
                        <InputText
                            className="app-shadow"
                            value={sessionName || ''}
                            onChange={handleOnChange}
                            placeholder="Session name"
                        />
                    </div>
                    <div className="flex-item p-mb-2">
                        <Button onClick={handleJoinButton} className="white-primary p-button-rounded p-m-1">
                            <i className="pi pi-users p-px-2" />
                            <span className="p-px-3">Join</span>
                        </Button>
                        <Button
                            onClick={() => handleHostButton('host')}
                            className="white-secondary p-button-rounded p-m-1"
                        >
                            <i className="pi pi-user-plus p-px-2" />
                            <span className="p-px-3">Create</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
