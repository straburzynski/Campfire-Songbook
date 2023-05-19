import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useHistory } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Sidebar } from 'primereact/sidebar';
import { confirmDialog } from 'primereact/confirmdialog';
import { Divider } from 'primereact/divider';
import logo from '../../resources/logo.png';
import SongList from '../shared/songList/SongList';
import ExternalSearch from '../shared/externalSearch/ExternalSearch';
import './header.scss';
import { removeItemFromLocalStorage } from '../../service/LocalStorageService';
import { useTranslation } from 'react-i18next';
import Preferences from '../shared/preferences/Preferences';
import { toast } from 'react-toastify';
import ReactPlayer from 'react-player';
import { Dialog } from 'primereact/dialog';
import { getResultList, getYoutubeUrl } from '../../service/YouTubeService';

const Header = () => {
    let history = useHistory();
    const { t } = useTranslation();
    const { sessionName, setSessionName, song, setSong, host, setHost } = useContext(AppContext);
    const menu = useRef<any>(null);

    const [songListModal, setSongListModal] = useState(false);
    const [externalSearchModal, setExternalSearchModal] = useState(false);
    const [preferencesModal, setPreferencesModal] = useState(false);
    const [youtubeModal, setYoutubeModal] = useState(false);
    const [url, setUrl] = useState('');

    const closeSongListModal = (): void => {
        setSongListModal(false);
    };
    const closeExternalSearchModal = (): void => {
        setExternalSearchModal(false);
    };

    const getYoutubeResults = (): void => {
        getResultList(song?.author + ' ' + song?.title).then((res) => {
            if (res.items.length > 0) {
                const url: string = getYoutubeUrl(res.items[0].id.videoId);
                setUrl(url);
                setYoutubeModal(true);
            } else {
                toast.warning(t('exception.video_not_found'));
            }
        });
    };

    function createYoutubeMenuItem() {
        if (song) {
            return {
                label: t('header.play_on_youtube'),
                icon: 'pi pi-youtube',
                command: () => getYoutubeResults(),
            };
        } else {
            return {
                template: <></>,
            };
        }
    }

    const items = [
        {
            template: (
                <>
                    <p className="menu-item session-name">
                        <span className={host ? 'p-menuitem-icon pi pi-user' : 'p-menuitem-icon pi pi-users'} />
                        {t('header.current_session')}:
                    </p>
                    <p className="menu-item p-text-bold p-ml-4">{sessionName || '---'}</p>
                    <Divider />
                </>
            ),
        },
        {
            label: t('header.song_list'),
            icon: 'pi pi-list',
            command: () => setSongListModal(true),
        },
        {
            label: t('header.external_search'),
            icon: 'pi pi-search',
            command: () => setExternalSearchModal(true),
        },
        createYoutubeMenuItem(),
        {
            template: <Divider />,
        },
        {
            label: t('header.preferences'),
            icon: 'pi pi-cog',
            command: () => setPreferencesModal(true),
        },
        {
            template: <Divider />,
        },
        {
            label: t('header.share'),
            icon: 'pi pi-share-alt',
            command: () => share(),
        },
        {
            template: <Divider />,
        },
        {
            label: t('header.exit_session'),
            icon: 'pi pi-times',
            command: () => confirmExitSession(),
        },
    ];

    const share = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Campfire Songbook',
                text: t('share.text', { sessionName: sessionName }),
                url: `${window.location.origin}/join/${sessionName}`,
            });
        } else {
            toast.warning(t('exception.cannot_share'));
        }
    };

    const confirmExitSession = () => {
        confirmDialog({
            showHeader: false,
            message: <div className="p-mt-6">{t('dialog.exit_session_confirmation')}</div>,
            accept: () => exitSession(),
            rejectLabel: t('common.no'),
            acceptLabel: t('common.yes'),
        });
    };

    const exitSession = () => {
        removeItemFromLocalStorage('sessionName');
        removeItemFromLocalStorage('password');
        setSessionName(undefined);
        setSong(undefined);
        setHost(false);
        history.push('/');
    };

    return (
        <div className="app-toolbar">
            <Toolbar
                left={
                    <>
                        <img alt="logo" src={logo} height="40" />
                        <div className="toolbar-title">Campfire Songbook</div>
                    </>
                }
                right={
                    <>
                        <Menu className="app-menu" model={items} popup ref={menu} id="popup_menu" />
                        <Button
                            className="white-secondary non-printable"
                            label=""
                            icon="pi pi-bars"
                            onClick={(event) => menu.current.toggle(event)}
                            aria-controls="popup_menu"
                            aria-haspopup
                        />
                    </>
                }
            />

            <Sidebar
                visible={songListModal}
                blockScroll={true}
                fullScreen={true}
                onHide={() => setSongListModal(false)}
                icons={<div className="modal-title">{t('header.song_list')}</div>}
            >
                <SongList onSongSelected={closeSongListModal} />
            </Sidebar>

            <Sidebar
                visible={externalSearchModal}
                blockScroll={true}
                fullScreen={true}
                onHide={() => setExternalSearchModal(false)}
                icons={<div className="modal-title">{t('header.external_search')}</div>}
            >
                <ExternalSearch onSongSelected={closeExternalSearchModal} />
            </Sidebar>

            <Dialog
                visible={youtubeModal}
                style={{ width: '90vw' }}
                onHide={() => setYoutubeModal(false)}
                dismissableMask={true}
                showHeader={true}
                focusOnShow={false}
                modal={true}
            >
                <ReactPlayer url={url} playing width="100%" height="100%" />
            </Dialog>

            <Sidebar
                visible={preferencesModal}
                blockScroll={true}
                fullScreen={false}
                position="right"
                className="preferences-sidebar"
                modal={true}
                onHide={() => setPreferencesModal(false)}
                icons={<div className="modal-title">{t('header.preferences')}</div>}
            >
                <Preferences />
            </Sidebar>
        </div>
    );
};
export default Header;
