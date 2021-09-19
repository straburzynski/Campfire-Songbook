import React, { useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Lyrics from '../shared/lyrics/Lyrics';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';

export default function Host() {
    let history = useHistory();
    const location = useLocation();
    const { song } = useContext(AppContext);

    useEffect(() => {
        if (!location?.state?.authorized) {
            toast.error('Not authorized to session');
            history.push('/');
        }
    }, [history, location]);

    return (
        <div className="p-p-2">
            <Lyrics song={song} />
        </div>
    );
}
