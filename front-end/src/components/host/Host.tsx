import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lyrics from '../shared/lyrics/Lyrics';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';
import SelectSong from '../shared/selectSong/SelectSong';
import { getItemFromLocalStorage } from '../../service/LocalStorageService';
import { createSession } from '../../service/SessionService';
import { SessionModel } from '../../model/SessionModel';
import { handleError } from '../../service/ExceptionService';
import { useTranslation } from 'react-i18next';
import { CustomExceptionModel } from '../../model/CustomExceptionModel';

export default function Host() {
    let navigate = useNavigate();
    const { sessionName, setSessionName, song, setSong, host, setHost } = useContext(AppContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (!sessionName) {
            const sessionNameFromUrl =  window.location.pathname.split('/').pop();
            const passwordFromStorage = getItemFromLocalStorage('password');
            if (sessionNameFromUrl && passwordFromStorage !== null) {
                createSession(sessionNameFromUrl, passwordFromStorage)
                    .then((res: SessionModel) => {
                        setSessionName(res.name);
                        setSong(res.song);
                        setHost(true);
                    })
                    .catch((err) => {
                        navigate('/');
                        const ex = err.response?.data as CustomExceptionModel;
                        if (ex?.translationKey) {
                            toast.warning(t(ex?.translationKey));
                        } else {
                            handleError(err);
                        }
                    });
            } else {
                toast.error(t('exception.not_authorized_to_session'));
                navigate('/');
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="p-2">
            <Lyrics song={song} showChordDiagrams={true} />
            <SelectSong song={song} host={host} />
        </div>
    );
}
