import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
    let history = useHistory();
    const { sessionName, setSessionName, song, setSong, host, setHost } = useContext(AppContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (!sessionName) {
            const sessionNameFromStorage = history.location.pathname.split('/').pop();
            const passwordFromStorage = getItemFromLocalStorage('password');
            if (sessionNameFromStorage && passwordFromStorage) {
                createSession(sessionNameFromStorage, passwordFromStorage)
                    .then((res: SessionModel) => {
                        setSessionName(res.name);
                        setSong(res.song);
                        setHost(true);
                    })
                    .catch((err) => {
                        history.push('/');
                        const ex = err.response?.data as CustomExceptionModel;
                        if (ex.translationKey) {
                            toast.warning(t(ex.translationKey));
                        } else {
                            handleError(err);
                        }
                    });
            } else {
                toast.error(t('exception.not_authorized_to_session'));
                history.push('/');
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="p-p-2">
            <Lyrics song={song} showChordDiagrams={true} />
            <SelectSong song={song} host={host} />
        </div>
    );
}
