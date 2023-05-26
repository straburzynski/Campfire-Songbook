import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CustomExceptionModel } from '../../model/CustomExceptionModel';

const Home = () => {
    let navigate = useNavigate();
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
                    navigate({ pathname: `/host/${sessionName}` });
                })
                .catch((err) => {
                    const ex = err.response?.data as CustomExceptionModel;
                    if (ex?.translationKey) {
                        toast.error(t(ex?.translationKey));
                    } else {
                        handleError(err);
                    }
                });
        }
    };

    const checkSession = (sessionName: string): void => {
        getSession(sessionName)
            .then((res: SessionModel) => {
                setSessionName(res.name);
                setSong(res.song);
                setHost(false);
                saveItemToLocalStorage('sessionName', sessionName);
                navigate(`/join/${sessionName}`, {
                    state: {
                        authorized: true,
                    },
                });
            })
            .catch((err) => {
                navigate('/');
                const ex = err.response?.data as CustomExceptionModel;
                if (ex.params.hasOwnProperty('name')) {
                    toast.warning(t(ex.translationKey, { name: ex.params['name'] }));
                } else {
                    handleError(err);
                }
            });
    };

    const handleHostChange = (e): void => {
        setSessionType(e);
    };

    const getHomeButtons = () => {
        return [
            { name: t('home.join'), value: SessionTypeEnum.JOIN },
            { name: t('home.create'), value: SessionTypeEnum.CREATE },
        ];
    };

    return (
        <div className="home">
            <div className="flex-container">
                <div className="row">
                    <div className="flex-item mb-2">
                        <img src={logo} className="logo" alt="Campfire Songs Logo" />
                    </div>
                    <div className="flex-item mb-6 title">Campfire Songbook</div>
                    <div className="flex-item mb-3">
                        <SelectButton
                            className="session-type-select"
                            unselectable={false}
                            value={sessionType}
                            optionLabel="name"
                            options={getHomeButtons()}
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
                                className="ml-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('home.password')}
                                type="password"
                            />
                        )}
                    </div>
                    <div className="flex-item mb-1 mt-3">
                        <Button onClick={() => handleButton()} className="white-primary button-rounded">
                            <span className="start-button">{t('home.start')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
