import React, { useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './header.css'
import AppContext from '../../context/AppContext';

const Header = () => {

    const appContext = useContext(AppContext);

    // const [sessionName, setSessionName] = useState(appContext.sessionName);

    useEffect(() => {
        console.log('header useEffect fire');
       // setSessionName(appContext.sessionName);
    }, [appContext.sessionName])

    let history = useHistory();

    const exitSession = () => {
        localStorage.removeItem("sessionName");
        appContext.changeSessionName(undefined);
        // setSessionName(undefined);
        history.push('/');
    }

    const ExitButton = () => {
        if (appContext.sessionName != null) {
            return <button type="button" onClick={() => exitSession()}>exit session</button>
        } else {
            return <div>no session</div>
        }
    }

    return (
        <div>
            <h2>Campfire song book</h2>
            <ExitButton/>
        </div>
    );
}

export default Header
