import React, { useContext, useEffect, useState } from 'react';
import Lyrics from '../shared/lyrics/Lyrics';
import { useNavigate, useParams } from 'react-router-dom';
import { SOCKET_URL } from '../../config/WebSocketConfig';
import AppContext from '../../context/AppContext';
import { getSession } from '../../service/SessionService';
import { SongModel } from '../../model/SongModel';
import { toast } from 'react-toastify';
import SelectSong from '../shared/selectSong/SelectSong';
import { saveItemToLocalStorage } from '../../service/LocalStorageService';
import { useTranslation } from 'react-i18next';
import { CustomExceptionModel } from '../../model/CustomExceptionModel';
import { handleError } from '../../service/ExceptionService';
import PullToRefresh from 'pulltorefreshjs';
import ReactDOMServer from 'react-dom/server';
import Subscribe from '../shared/websockets/subscribe/Subscribe';
import { StompSessionProvider } from 'react-stomp-hooks';

export default function Join() {
    let { sessionName: sessionNameFromUrl } = useParams();
    let navigate = useNavigate();
    const { t } = useTranslation();
    const { offlineMode, host, setHost, sessionName, setSessionName, song, setSong } = useContext(AppContext);
    const [loadingFinished, setLoadingFinished] = useState<boolean>(false);

    useEffect(() => {
        if (sessionName || sessionNameFromUrl === undefined) {
            return;
        }
        getSession(sessionNameFromUrl)
            .then((res) => {
                setSessionName(res.name);
                setSong(res.song);
                setHost(false);
                saveItemToLocalStorage('sessionName', res.name);
            })
            .catch((err) => {
                navigate('/');
                const ex = err.response?.data as CustomExceptionModel;
                if (ex?.params?.hasOwnProperty('name')) {
                    toast.warning(t(ex.translationKey, { name: ex.params['name'] }));
                } else {
                    handleError(err);
                }
            })
            .finally(() => {
                setLoadingFinished(true);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        PullToRefresh.init({
            mainElement: '.lyrics',
            onRefresh() {
                window.location.reload();
            },
            iconArrow: ReactDOMServer.renderToString(
                <i className="pi pi-arrow-down genericon" style={{ fontSize: '2rem' }}></i>,
            ),
            instructionsPullToRefresh: t('common.pull_to_refresh'),
            instructionsReleaseToRefresh: t('common.release_to_refresh'),
            instructionsRefreshing: t('common.refreshing'),
        });
        return () => {
            PullToRefresh.destroyAll();
        };
    });

    let onMessageReceived = (msg: SongModel) => {
        setSong(msg);
        scrollToTop();
    };

    const scrollToTop = () => {
        window.scroll({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="p-2 lyrics">
            <Lyrics song={song} />
            {loadingFinished && <SelectSong song={song} host={host} />}
            {sessionName && !offlineMode && (
                <StompSessionProvider url={SOCKET_URL}>
                    <Subscribe sessionName={sessionName} onMessageReceived={onMessageReceived} />
                </StompSessionProvider>
            )}
        </div>
    );
}
