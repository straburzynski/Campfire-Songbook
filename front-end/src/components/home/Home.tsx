import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './home.css'
import API from '../../config/ApiConfig';
import { SessionModel } from '../../model/SessionModel';
import AppContext from '../../context/AppContext';

export default function Home() {

    const [sessionName, setSessionName] = useState(localStorage.getItem("sessionName") || undefined)
    const appContext = useContext(AppContext);

    let history = useHistory();

    const saveSessionNameToLocalStorage = (sessionName): void => {
        console.log('saving sessionName', sessionName);
        localStorage.setItem("sessionName", sessionName);
    }

    const handleButton = (url: string): void => {
        if (sessionName == null) {
            alert('no session name');
        } else {
            saveSessionNameToLocalStorage(sessionName)
            history.push(`/${url}/${sessionName}`)
        }
    }

    const handleJoinButton = (): void => {
        if (sessionName == null) {
            alert('no session name');
        } else {
            getSession(sessionName);
        }
    }

    const getSession = async (sessionName: string) => {
        API.get<SessionModel>(`sessions/${sessionName}`)
            .then(res => {
                const session: SessionModel = res.data;
                appContext.changeSessionName(session.name);
                appContext.changeSongId(session.songId);
                saveSessionNameToLocalStorage(sessionName);
                history.push(`/join/${sessionName}`);
            })
            .catch(err => {
                console.log(err);
                alert('no session found');
            })
    }

    return (
        <div>
            <input type='text' value={sessionName || ''} onChange={event => setSessionName(event.target.value)}/>
            <ul>
                <li onClick={() => handleButton('host')}>host</li>
                <li onClick={handleJoinButton}>join</li>
                <li><Link to="/songs">songs</Link></li>
            </ul>
        </div>
    );
}
