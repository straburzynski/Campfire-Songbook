import React, { useContext, useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { Toolbar } from 'primereact/toolbar';
import { Sidebar } from 'primereact/sidebar';
import SongList from '../songList/SongList';
import { confirmDialog } from 'primereact/confirmdialog';
import logo from '../../resources/logo.png';
import './header.css';

const Header = () => {
    let history = useHistory();

    const [visibleFullScreen, setVisibleFullScreen] = useState(false);
    const appContext = useContext(AppContext);
    const menu = useRef<any>(null);

    const closeFullScreen = () => {
        setVisibleFullScreen(false);
    };

    const currentSession = () => (
        <>
            <p className={'menu-item'}> Current session:</p>
            <p className={'menu-item'}>
                <strong>{appContext?.sessionName}</strong>
            </p>
            <hr />
        </>
    );
    const items = [
        {
            template: currentSession,
        },
        {
            label: 'Song list',
            icon: 'pi pi-list',
            command: () => setVisibleFullScreen(true),
        },
        {
            label: 'Exit session',
            icon: 'pi pi-times',
            command: () => confirmExitSession(),
        },
    ];
    const confirmExitSession = () => {
        confirmDialog({
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

    const start = () => {
        return (
            <>
                <img alt="logo" src={logo} height="40" className="p-mr-2" />
                <div>Campfire Songbook</div>
            </>
        );
    };
    const end = () => {
        return (
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
        );
    };
    const customIcons = (
        <React.Fragment>
            <div className="modal-title">Song list</div>
        </React.Fragment>
    );

    return (
        <div>
            <Toolbar left={start} right={end} />
            <Sidebar
                visible={visibleFullScreen}
                blockScroll={true}
                fullScreen={true}
                onHide={() => setVisibleFullScreen(false)}
                icons={customIcons}
            >
                <SongList onSongSelected={closeFullScreen} />
            </Sidebar>
        </div>
    );
};
export default Header;
