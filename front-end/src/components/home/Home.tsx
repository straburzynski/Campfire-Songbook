import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createSession, getSession } from '../../service/SessionService';
import AppContext from '../../context/AppContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { AppContextModel } from '../../model/AppContextModel';
import './home.scss';
import logo from '../../resources/logo-shadow.png';
import { SessionModel } from '../../model/SessionModel';
import { SessionTypeEnum } from '../../model/SessionTypeEnum';
import { toast } from 'react-toastify';
import { SessionTypeOptions } from './SessionTypeOptions';

const Home = () => {
    let history = useHistory();
    const { setSong, sessionName, setSessionName, setHost } = useContext<AppContextModel>(AppContext);

    const [sessionType, setSessionType] = useState(SessionTypeEnum.JOIN);
    const [password, setPassword] = useState('');

    useEffect(() => {
        const savedSessionName = localStorage.getItem('sessionName');
        if (savedSessionName) {
            setSessionName(savedSessionName);
        }
    }, [setSessionName]);

    const saveSessionNameToLocalStorage = (sessionName): void => {
        localStorage.setItem('sessionName', sessionName);
    };

    const handleButton = (): void => {
        if (sessionName == null || sessionName === '') {
            toast.warn('Enter session name');
            return;
        }
        if (sessionType === SessionTypeEnum.JOIN) {
            checkSession(sessionName);
        } else if (sessionType === SessionTypeEnum.CREATE) {
            saveSessionNameToLocalStorage(sessionName);
            createSession(sessionName, password)
                .then((res: SessionModel) => {
                    setSessionName(res.name);
                    setSong(res.song);
                    setHost(true);
                    history.push({
                        pathname: `/host/${sessionName}`,
                        state: {
                            authorized: true,
                        },
                    });
                })
                .catch((err) => {
                    console.log(err);
                    toast.error('Not authorized to session');
                });
        }
    };

    const checkSession = (sessionName: string): void => {
        getSession(sessionName)
            .then((res: SessionModel) => {
                setSessionName(res.name);
                setSong(res.song);
                setHost(false);
                saveSessionNameToLocalStorage(sessionName);
                history.push({
                    pathname: `/join/${sessionName}`,
                    state: {
                        authorized: true,
                    },
                });
            })
            .catch(() => {
                toast.warn('Session not found');
            });
    };

    const handleHostChange = (e): void => {
        setSessionType(e);
    };

    return (
        <div className="home">
            <div className="flex-container">
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
                            options={SessionTypeOptions}
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
