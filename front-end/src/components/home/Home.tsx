import React, { useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { getSession } from '../../service/SessionService';
import AppContext from '../../context/AppContext';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { AppContextModel } from '../../model/AppContextModel';
import { Toast } from 'primereact/toast';
import { toastConfig } from '../../config/ToastConfig';
import './home.css';

const Home = () => {
    let history = useHistory();
    const { setSong, sessionName, setSessionName } = useContext<AppContextModel>(AppContext);
    const toast = useRef<any>(null);

    useEffect(() => {
        const savedSessionName = localStorage.getItem('sessionName');
        if (savedSessionName) {
            setSessionName(savedSessionName);
        }
    }, []);

    const showToast = () => {
        toast.current.show(toastConfig('warn', 'Session not found'));
    };

    const saveSessionNameToLocalStorage = (sessionName): void => {
        localStorage.setItem('sessionName', sessionName);
    };

    const handleHostButton = (url: string): void => {
        if (sessionName == null) {
            showToast();
        } else {
            saveSessionNameToLocalStorage(sessionName);
            history.push(`/${url}/${sessionName}`);
        }
    };

    const handleJoinButton = (): void => {
        if (sessionName == null) {
            showToast();
        } else {
            checkSession(sessionName);
        }
    };

    const checkSession = (sessionName: string): void => {
        getSession(sessionName)
            .then((res) => {
                setSessionName(res.name);
                setSong(res.song);
                saveSessionNameToLocalStorage(sessionName);
                history.push(`/join/${sessionName}`);
            })
            .catch(() => {
                showToast();
            });
    };

    const handleOnChange = (e) => {
        setSessionName(e.target.value);
    };

    return (
        <>
            <Toast ref={toast} position="bottom-center" />

            <Card className="home">
                <div className="p-d-flex p-flex-column p-jc-center p-ai-center">
                    <div className="p-mb-2">Logo</div>
                    <div className="p-mb-2">Campfire Songbook</div>
                    <div className="p-mb-2">
                        <InputText value={sessionName || ''} onChange={handleOnChange} />
                    </div>
                    <div className="p-mb-2">
                        <Button onClick={handleJoinButton} className="p-m-1">
                            <i className="pi pi-users p-px-2" />
                            <span className="p-px-3">Join</span>
                        </Button>
                        <Button onClick={() => handleHostButton('host')} className="p-m-1 p-button-secondary">
                            <i className="pi pi-user-plus p-px-2" />
                            <span className="p-px-3">Create</span>
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default Home;
