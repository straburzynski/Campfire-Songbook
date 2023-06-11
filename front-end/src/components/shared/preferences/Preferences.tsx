import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import i18next from 'i18next';
import './preferences.scss';
import AppContext from '../../../context/AppContext';
import { InstrumentEnum } from '../../../model/InstrumentEnum';
import { Button } from 'primereact/button';
import { removeItemFromLocalStorage, saveItemToLocalStorage } from '../../../service/LocalStorageService';
import { DEFAULT_FONT_SIZE } from '../../../config/AppConfig';
import { useNavigate } from 'react-router-dom';
import { getAllSongs } from '../../../service/SongService';

const Preferences = ({ onDisableOfflineNode }) => {
    const {
        sessionName,
        instrument,
        setInstrument,
        fontSize,
        setFontSize,
        autoColumnsOn,
        setAutoColumnsOn,
        columnsCount,
        setColumnsCount,
        offlineMode,
        setOfflineMode,
        setSong,
        setSessionName,
        setHost,
    } = useContext(AppContext);
    let navigate = useNavigate();
    const { t } = useTranslation();
    const languages = [
        { name: t('language.polish'), value: 'pl' },
        { name: t('language.english'), value: 'en' },
    ];
    const instruments = [
        { name: t('instrument.guitar'), value: InstrumentEnum.GUITAR },
        { name: t('instrument.ukulele'), value: InstrumentEnum.UKULELE },
    ];

    const booleanOptions = [
        { name: t('common.yes'), value: true },
        { name: t('common.no'), value: false },
    ];

    const columns = [
        { name: `1 (${t('common.default')})`, value: 1 },
        { name: '2', value: 2 },
        { name: '3', value: 3 },
    ];

    const changeLang = (e): void => {
        i18next.changeLanguage(e.value);
    };

    const changeInstrument = (e): void => {
        saveItemToLocalStorage('instrument', e.value);
        setInstrument(e.value);
    };

    const incrementFontSize = (): void => {
        saveItemToLocalStorage('fontSize', fontSize! + 1);
        setFontSize(fontSize! + 1);
    };
    const decrementFontSize = (): void => {
        saveItemToLocalStorage('fontSize', fontSize! - 1);
        setFontSize(fontSize! - 1);
    };
    const resetFontSize = (): void => {
        saveItemToLocalStorage('fontSize', DEFAULT_FONT_SIZE);
        setFontSize(DEFAULT_FONT_SIZE);
    };

    const changeAutoColumns = (e): void => {
        saveItemToLocalStorage('autoColumnsOn', e.value);
        setAutoColumnsOn(e.value);
    };

    const changeColumnsCount = (e): void => {
        saveItemToLocalStorage('columnsCount', e.value);
        setColumnsCount(e.value);
    };
    const changeOfflineMode = (e): void => {
        if (e.value) {
            getAllSongs(true).then((songs) => {
                saveItemToLocalStorage('songs', JSON.stringify(songs));
                saveItemToLocalStorage('session', JSON.stringify({ name: sessionName }));
            });
        } else {
            onDisableOfflineNode();
            removeItemFromLocalStorage('session');
            removeItemFromLocalStorage('sessionName');
            removeItemFromLocalStorage('password');
            setOfflineMode(false);
            setSessionName(undefined);
            setSong(undefined);
            setHost(false);
            navigate('/');
        }
        saveItemToLocalStorage('offlineMode', e.value);
        setOfflineMode(e.value);
    };

    return (
        <div className='preferences p-3'>
            <div className='field grid mt-3'>
                <label className='col-fixed p-width-50'>{t('preferences.language')}</label>
                <div className='col'>
                    <Dropdown
                        value={i18next.resolvedLanguage}
                        options={languages}
                        onChange={changeLang}
                        optionLabel='name'
                    />
                </div>
            </div>
            <hr />
            <div className='field grid mt-3'>
                <label className='col-fixed p-width-50'>{t('preferences.instrument')}</label>
                <div className='col'>
                    <Dropdown value={instrument} options={instruments} onChange={changeInstrument} optionLabel='name' />
                </div>
            </div>
            <hr />
            <div className='field grid mt-3'>
                <label className='col-fixed p-width-50'>{t('preferences.font_size')}</label>
                <div className='col'>
                    <span className='p-buttonset'>
                        <Button
                            icon='pi pi-minus'
                            onClick={decrementFontSize}
                            severity='secondary'
                            size='small'
                            outlined
                            text
                        />
                        <Button label={fontSize?.toString()} onClick={resetFontSize} severity='secondary' text />
                        <Button
                            icon='pi pi-plus'
                            onClick={incrementFontSize}
                            severity='secondary'
                            size='small'
                            outlined
                            text
                        />
                    </span>
                </div>
            </div>
            <hr />
            <div className='field grid mt-3'>
                <label className='col-fixed p-width-50'>{t('preferences.autoColumnsOn')}</label>
                <div className='col'>
                    <Dropdown
                        value={autoColumnsOn}
                        options={booleanOptions}
                        onChange={changeAutoColumns}
                        optionLabel='name'
                    />
                </div>
            </div>
            <hr />
            <div className='field grid mt-3'>
                <label className='col-fixed p-width-50'>{t('preferences.columnsCount')}</label>
                <div className='col'>
                    <Dropdown
                        disabled={autoColumnsOn}
                        value={columnsCount}
                        options={columns}
                        onChange={changeColumnsCount}
                        optionLabel='name'
                    />
                </div>
            </div>
            <hr />
            <div className='field grid mt-3'>
                <label className='col-fixed p-width-50'>{t('preferences.offlineMode')}</label>
                <div className='col'>
                    <Dropdown
                        value={offlineMode}
                        options={booleanOptions}
                        onChange={changeOfflineMode}
                        optionLabel='name'
                    />
                </div>
            </div>
            <hr />
        </div>
    );
};

export default Preferences;
