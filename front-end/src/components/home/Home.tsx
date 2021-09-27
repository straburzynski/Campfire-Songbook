import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createSession, getSession } from '../../service/SessionService';
import AppContext from '../../context/AppContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { AppContextModel } from '../../model/AppContextModel';
import logo from '../../resources/logo-shadow.png';
import { SessionModel } from '../../model/SessionModel';
import { SessionTypeEnum } from '../../model/SessionTypeEnum';
import { toast } from 'react-toastify';
import { handleError } from '../../service/ExceptionService';
import { getItemFromLocalStorage, saveItemToLocalStorage } from '../../service/LocalStorageService';
import { useTranslation } from 'react-i18next';
import './home.scss';

const Home = () => {
    let history = useHistory();
    const { setSong, sessionName, setSessionName, setHost } = useContext<AppContextModel>(AppContext);
    const { t } = useTranslation();
    const [sessionType, setSessionType] = useState(SessionTypeEnum.JOIN);
    const [password, setPassword] = useState('');

    useEffect(() => {
        const savedSessionName = getItemFromLocalStorage('sessionName');
        if (savedSessionName) {
            setSessionName(savedSessionName);
        }
    }, [setSessionName]);

    const handleButton = (): void => {
        if (sessionName == null || sessionName === '') {
            toast.warn(t('home.enter_session_name'));
            return;
        }
        if (sessionType === SessionTypeEnum.JOIN) {
            checkSession(sessionName);
        } else if (sessionType === SessionTypeEnum.CREATE) {
            createSession(sessionName, password)
                .then((res: SessionModel) => {
                    saveItemToLocalStorage('sessionName', sessionName);
                    saveItemToLocalStorage('password', password);
                    setSessionName(res.name);
                    setSong(res.song);
                    setHost(true);
                    history.push({ pathname: `/host/${sessionName}` });
                })
                .catch((err) => handleError(err));
        }
    };

    const checkSession = (sessionName: string): void => {
        getSession(sessionName)
            .then((res: SessionModel) => {
                setSessionName(res.name);
                setSong(res.song);
                setHost(false);
                saveItemToLocalStorage('sessionName', sessionName);
                history.push({
                    pathname: `/join/${sessionName}`,
                    state: {
                        authorized: true,
                    },
                });
            })
            .catch((err) => handleError(err));
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
                            options={[
                                { name: 'Dołącz', value: SessionTypeEnum.JOIN },
                                { name: 'Stwórz', value: SessionTypeEnum.CREATE },
                            ]}
                            onChange={(e) => handleHostChange(e.value)}
                        />
                    </div>
                    <div className="flex-item">
                        <InputText
                            value={sessionName || ''}
                            onChange={(e) => setSessionName(e.target.value)}
                            placeholder={t('home.session_name')}
                        />
                        {sessionType === SessionTypeEnum.CREATE && (
                            <InputText
                                className="p-ml-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('home.password')}
                                type="password"
                            />
                        )}
                    </div>
                    <div className="flex-item p-mb-1 p-mt-3">
                        <Button onClick={() => handleButton()} className="white-primary p-button-rounded">
                            <span className="start-button">{t('home.start')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
