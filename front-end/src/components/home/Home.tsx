import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getSession } from '../../service/SessionService';
import './home.css';
import AppContext from '../../context/AppContext';

export default function Home() {
    const [sessionName, setSessionName] = useState(localStorage.getItem('sessionName') || undefined);
    const appContext = useContext(AppContext);

    let history = useHistory();

    const saveSessionNameToLocalStorage = (sessionName): void => {
        console.log('saving sessionName', sessionName);
        localStorage.setItem('sessionName', sessionName);
    };

    const handleHostButton = (url: string): void => {
        if (sessionName == null) {
            alert('no session name');
        } else {
            saveSessionNameToLocalStorage(sessionName);
            history.push(`/${url}/${sessionName}`);
        }
    };

    const handleJoinButton = (): void => {
        if (sessionName == null) {
            alert('no session name');
        } else {
            checkSession(sessionName);
        }
    };

    const checkSession = (sessionName: string): void => {
        getSession(sessionName)
            .then((res) => {
                console.log(res);
                appContext.changeSessionName(res.name);
                appContext.changeSongId(res.songId);
                saveSessionNameToLocalStorage(sessionName);
                history.push(`/join/${sessionName}`);
            })
            .catch((err) => {
                console.log(err);
                alert('no session found');
            });
    };

    return (
        <div>
            <input type="text" value={sessionName || ''} onChange={(event) => setSessionName(event.target.value)} />
            <ul>
                <li onClick={() => handleHostButton('host')}>host</li>
                <li onClick={handleJoinButton}>join</li>
                <li>
                    <Link to="/songs">songs</Link>
                </li>
            </ul>
        </div>
    );
}
