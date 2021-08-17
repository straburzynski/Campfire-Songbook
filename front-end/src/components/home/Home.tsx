import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import './home.css'

export default function Home() {
    const [sessionName, setSessionName] = useState("")
    let history = useHistory();

    const handleButton = (url) => {
        if (sessionName === "" || sessionName == null) {
            alert('no session name');
        } else {
            history.push(`/${url}/${sessionName}`)
        }
    }

    return <div>
        <h2>Campfire song book</h2>
        <input type='text' name='sessionName' value={sessionName} onChange={e => setSessionName(e.target.value)}/>
        <ul>
            <li onClick={() => handleButton('host')}>host</li>
            <li onClick={() => handleButton('join')}>join</li>
            <li><Link to="/songs">Songs</Link></li>
        </ul>
    </div>;
}
