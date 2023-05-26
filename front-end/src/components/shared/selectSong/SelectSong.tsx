import React from 'react';
import './selectSong.scss';
import { useTranslation } from 'react-i18next';

const SelectSong = (props) => {
    const { t} = useTranslation();

    return (
        <>
            {!props.song && props.host && (
                <div className="select-song">
                    <p className="mb-0">
                        <span className="pi pi-arrow-up" />
                    </p>
                    <p>{t('common.select_song')}</p>
                </div>
            )}
            {!props.song && !props.host && (
                <div className="no-song-selected">
                    <p>{t('dialog.no_song_selected')}</p>
                </div>
            )}
        </>
    );
};
export default SelectSong;
