import React, { useCallback } from 'react';
import { Button } from 'primereact/button';
import Lyrics from '../lyrics/Lyrics';
import { Dialog } from 'primereact/dialog';
import { SongModel } from '../../../model/SongModel';

interface SongDetailsDialogModel {
    song: SongModel;
    host?: boolean;
    showDialog?: boolean;
    onSongSelected: Function;
    onShowDialog: Function;
    onSetSong: Function;
}

const SongDetailsDialog = React.memo((props: SongDetailsDialogModel) => {
    const onDialogHide = useCallback((selected: boolean, song?: SongModel) => {
        if (selected) {
            props.onSetSong(song);
        }
        props.onShowDialog(false);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Dialog
                visible={props.showDialog}
                style={{ width: '90vw' }}
                footer={
                    <div>
                        <Button
                            label="Close"
                            icon="pi pi-times"
                            onClick={() => onDialogHide(false)}
                            className="p-button-text"
                        />
                        {props.host && (
                            <Button
                                label="Select"
                                icon="pi pi-check"
                                onClick={() => onDialogHide(true, props.song)}
                                autoFocus
                            />
                        )}
                    </div>
                }
                onHide={() => onDialogHide(false)}
                dismissableMask={true}
                showHeader={false}
            >
                <Lyrics song={props.song} />
            </Dialog>
        </>
    );
});

export default SongDetailsDialog;
