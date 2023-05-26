import React from 'react';
import './notFound.scss';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    let navigate = useNavigate();
    const { t } = useTranslation();

    const handleButton = () => {
        navigate('/');
    };

    return (
        <div className="not-found">
            <h2>404</h2>
            <p>{t('exception.not_found')}</p>
            <Button onClick={() => handleButton()} className="home-button button-rounded">
                <span className="text-center">{t('common.home')}</span>
            </Button>
        </div>
    );
}
