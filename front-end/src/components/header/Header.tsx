import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import './header.css';

const Header = () => {
    const appContext = useContext(AppContext);

    useEffect(() => {
        console.log('header useEffect fire');
    }, [appContext.sessionName]);

    let history = useHistory();

    const exitSession = () => {
        localStorage.removeItem('sessionName');
        appContext.changeSessionName(undefined);
        appContext.changeSongId(undefined);
        history.push('/');
    };

    const ExitButton = () => {
        if (appContext.sessionName != null) {
            return (
              <button type="button" onClick={() => exitSession()}>
                  exit session
              </button>
            );
        } else {
            return null;
        }
    };

    return (
      <div>
          <h2>Campfire song book</h2>
          <ExitButton />
      </div>
    );
};

export default Header;
