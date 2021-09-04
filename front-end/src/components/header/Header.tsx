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
import SongList from '../songList/SongList';
import ExternalSearch from '../externalSearch/ExternalSearch';
import './header.css';

const Header = () => {
    let history = useHistory();

    const appContext = useContext(AppContext);
    const [songListModal, setSongListModal] = useState(false);
    const [externalSearchModal, setExternalSearchModal] = useState(false);
    const menu = useRef<any>(null);

    const closeSongListModal = () => {
        setSongListModal(false);
    };
    const closeExternalSearchModal = () => {
        setExternalSearchModal(false);
    };

    const items = [
        {
            template: (
                <>
                    <p className="menu-item"> Current session:</p>
                    <p className="menu-item p-text-bold">{appContext?.sessionName}</p>
                    <Divider />
                </>
            ),
        },
        {
            label: 'Song list',
            icon: 'pi pi-list',
            command: () => setSongListModal(true),
        },
        {
            label: 'External search',
            icon: 'pi pi-search',
            command: () => setExternalSearchModal(true),
        },
        {
            template: <Divider />,
        },
        {
            label: 'Exit session',
            icon: 'pi pi-times',
            command: () => confirmExitSession(),
        },
    ];

    const confirmExitSession = () => {
        confirmDialog({
            showHeader: false,
            message: 'Are you sure you want to exit session?',
            accept: () => exitSession(),
        });
    };

    const exitSession = () => {
        localStorage.removeItem('sessionName');
        appContext.changeSessionName(undefined);
        appContext.changeSong(undefined);
        appContext.changeHost(false);
        history.push('/');
    };

    const customIcons = <div className="modal-title">Song list</div>;

    return (
        <div>
            <Toolbar
                left={
                    <>
                        <img alt="logo" src={logo} height="40" className="p-mr-2" />
                        <div>Campfire Songbook</div>
                    </>
                }
                right={
                    <>
                        <Menu model={items} popup ref={menu} id="popup_menu" />
                        <Button
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
                icons={customIcons}
            >
                <SongList onSongSelected={closeSongListModal} />
            </Sidebar>

            <Sidebar
                visible={externalSearchModal}
                blockScroll={true}
                fullScreen={true}
                onHide={() => setExternalSearchModal(false)}
                icons={customIcons}
            >
                <ExternalSearch onSongSelected={closeExternalSearchModal} />
            </Sidebar>
        </div>
    );
};
export default Header;
