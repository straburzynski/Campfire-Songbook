import React from 'react';
import './notFound.scss';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';

export default function NotFound() {
    let history = useHistory();

    const handleButton = () => {
        history.push('/');
    };

    return (
        <div className="not-found">
            <h2>404</h2>
            <p>- Not found -</p>
            <Button onClick={() => handleButton()} className="home-button p-button-rounded">
                <span className="p-text-center">Home</span>
            </Button>
        </div>
    );
}
