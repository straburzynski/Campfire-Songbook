import React from 'react';
import './notFound.scss';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    let history = useHistory();
    const { t } = useTranslation();

    const handleButton = () => {
        history.push('/');
    };

    return (
        <div className="not-found">
            <h2>404</h2>
            <p>{t('exception.not_found')}</p>
            <Button onClick={() => handleButton()} className="home-button p-button-rounded">
                <span className="p-text-center">{t('common.home')}</span>
            </Button>
        </div>
    );
}
