import React from 'react';
import './selectSong.scss';

const SelectSong = (props) => {
    return (
        <>
            {!props.song && props.host && (
                <div className="select-song">
                    <p className="p-mb-0">
                        <span className="pi pi-arrow-up" />
                    </p>
                    <p>Select song</p>
                </div>
            )}
            {!props.song && !props.host && (
                <div className="no-song-selected">
                    <p>The song has not been selected yet</p>
                </div>
            )}
        </>
    );
};
export default SelectSong;
