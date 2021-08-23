import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import './home.css'

export default function Home() {

    const [sessionName, setSessionName] = useState(localStorage.getItem("sessionName") || undefined)

    let history = useHistory();

    // useEffect(() => {
    //     console.log('home use effect fired');
    //     console.log('sessionName', sessionName);
    // }, [sessionName]);

    const saveSessionNameToLocalStorage = (sessionName): void => {
        // set session name to local storage
        console.log('saving sessionName', sessionName);
        localStorage.setItem("sessionName", sessionName);
    }

    const handleButton = (url: string): void => {
        if (sessionName === "" || sessionName == null) {
            alert('no session name');
        } else {
            saveSessionNameToLocalStorage(sessionName)
            history.push(`/${url}/${sessionName}`)
        }
    }

    const handleInputChange = (event): void => {
        // event.preventDefault();
        // console.log(event.target.value);
        setSessionName(event.target.value);
    }

    return (
        <div>
            <input type='text' value={sessionName || ''} onChange={handleInputChange}/>
            <ul>
                <li onClick={() => handleButton('host')}>host</li>
                <li onClick={() => handleButton('join')}>join</li>
                <li><Link to="/songs">songs</Link></li>
            </ul>
        </div>
    );
}
