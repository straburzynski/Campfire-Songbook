import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getSession } from '../../service/SessionService';
import AppContext from '../../context/AppContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { AppContextModel } from '../../model/AppContextModel';
import { Toast } from 'primereact/toast';
import { toastConfig } from '../../config/ToastConfig';
import './home.scss';
import logo from '../../resources/logo.png';
import { SessionModel } from '../../model/SessionModel';
import { SessionTypeEnum } from '../../model/SessionTypeEnum';

const Home = () => {
    let history = useHistory();
    const { setSong, sessionName, setSessionName } = useContext<AppContextModel>(AppContext);
    const toast = useRef<any>(null);

    const [sessionType, setSessionType] = useState(SessionTypeEnum.JOIN);
    const [password, setPassword] = useState('');
    const sessionTypeOptions = [
        { name: 'Join', value: SessionTypeEnum.JOIN },
        { name: 'Create', value: SessionTypeEnum.CREATE },
    ];

    useEffect(() => {
        const savedSessionName = localStorage.getItem('sessionName');
        if (savedSessionName) {
            setSessionName(savedSessionName);
        }
    }, [setSessionName]);

    const showToast = (text: string): void => {
        toast.current.show(toastConfig('warn', text));
    };

    const saveSessionNameToLocalStorage = (sessionName): void => {
        localStorage.setItem('sessionName', sessionName);
    };

    const handleButton = (): void => {
        if (sessionName == null || sessionName === '') {
            showToast('Enter session name');
            return;
        }
        if (sessionType === SessionTypeEnum.JOIN) {
            checkSession(sessionName);
        } else if (sessionType === SessionTypeEnum.CREATE) {
            saveSessionNameToLocalStorage(sessionName);
            history.push({
                pathname: `/host/${sessionName}`,
                state: {
                    password: password,
                },
            });
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

    const handleHostChange = (e): void => {
        setSessionType(e);
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
                    <div className="flex-item p-mb-3">
                        <SelectButton
                            className="session-type-select"
                            unselectable={false}
                            value={sessionType}
                            optionLabel="name"
                            options={sessionTypeOptions}
                            onChange={(e) => handleHostChange(e.value)}
                        />
                    </div>
                    <div className="flex-item">
                        <InputText
                            value={sessionName || ''}
                            onChange={(e) => setSessionName(e.target.value)}
                            placeholder="Session name"
                        />
                    </div>

                    {sessionType === SessionTypeEnum.CREATE && (
                        <div className="flex-item p-mt-1">
                            <InputText
                                // className="app-shadow"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                type="password"
                            />
                        </div>
                    )}
                    <div className="flex-item p-mb-1 p-mt-3">
                        <Button onClick={() => handleButton()} className="white-primary p-button-rounded">
                            <span className="start-button">Start</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
