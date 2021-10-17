import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import i18next from 'i18next';
import './preferences.scss';
import AppContext from '../../../context/AppContext';
import { InstrumentEnum } from '../../../model/InstrumentEnum';
import { Button } from 'primereact/button';

const Preferences = () => {
    const { instrument, setInstrument, fontSize, setFontSize } = useContext(AppContext);
    const { t } = useTranslation();

    const languages = [
        { name: t('language.polish'), value: 'pl' },
        { name: t('language.english'), value: 'en' },
    ];
    const instruments = [
        { name: t('instrument.guitar'), value: InstrumentEnum.GUITAR },
        { name: t('instrument.ukulele'), value: InstrumentEnum.UKULELE },
    ];

    const changeLang = (e): void => {
        i18next.changeLanguage(e.value);
    };

    const changeInstrument = (e): void => {
        setInstrument(e.value);
    };

    const incrementFontSize = (): void => {
        setFontSize(fontSize! + 1);
    };
    const decrementFontSize = (): void => {
        setFontSize(fontSize! - 1);
    };
    const resetFontSize = (): void => {
        setFontSize(13);
    };

    return (
        <div className="preferences p-p-3">
            <div className="p-field p-grid p-mt-3">
                <label className="p-col-fixed p-width-50">{t('preferences.language')}</label>
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
            <div className="p-field p-grid p-mt-3">
                <label className="p-col-fixed p-width-50">{t('preferences.instrument')}</label>
                <div className="p-col">
                    <Dropdown value={instrument} options={instruments} onChange={changeInstrument} optionLabel="name" />
                </div>
            </div>
            <hr />
            <div className="p-field p-grid p-mt-3">
                <label className="p-col-fixed p-width-50">{t('preferences.font_size')}</label>
                <div className="p-col">
                    <span className="p-buttonset">
                        <Button
                            icon="pi pi-minus"
                            onClick={decrementFontSize}
                            className="p-button-secondary p-button-outlined p-button-sm"
                        />
                        <Button
                            label={fontSize?.toString()}
                            onClick={resetFontSize}
                            className="p-button-secondary p-button-text"
                        />
                        <Button
                            icon="pi pi-plus"
                            onClick={incrementFontSize}
                            className="p-button-secondary p-button-outlined p-button-sm"
                        />
                    </span>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default Preferences;
