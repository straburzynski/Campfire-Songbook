import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import i18next from 'i18next';
import './preferences.scss';

const Preferences = () => {
    const { t } = useTranslation();

    const languages = [
        { name: t('language.polish'), value: 'pl' },
        { name: t('language.english'), value: 'en' },
    ];

    const changeLang = (e): void => {
        i18next.changeLanguage(e.value);
    };

    return (
        <div className="preferences p-p-3">
            <div className="p-field p-grid">
                <label className="p-col-fixed" style={{ width: '100px' }}>
                    {t('preferences.language')}
                </label>
                <div className="p-col">
                    <Dropdown
                        value={i18next.resolvedLanguage}
                        options={languages}
                        onChange={changeLang}
                        optionLabel="name"
                    />
                </div>
            </div>

            <hr />
        </div>
    );
};

export default Preferences;
