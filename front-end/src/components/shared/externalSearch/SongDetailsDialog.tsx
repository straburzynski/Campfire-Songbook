import React, { FC, useCallback } from 'react';
import { Button } from 'primereact/button';
import Lyrics from '../lyrics/Lyrics';
import { Dialog } from 'primereact/dialog';
import { SongModel } from '../../../model/SongModel';
import './songDetailsDialog.scss';
import { saveSong } from '../../../service/SongService';
import { toast } from 'react-toastify';
import { handleError } from '../../../service/ExceptionService';

interface SongDetailsDialogModel {
    song: SongModel;
    host?: boolean;
    showDialog?: boolean;
    onSongSelected: Function;
    onShowDialog: Function;
}

const SongDetailsDialog: FC<SongDetailsDialogModel> = ({ song, host, showDialog, onSongSelected, onShowDialog }) => {
    const onDialogHide = useCallback(
        (selected: boolean, song?: SongModel) => {
            if (selected) {
                onSongSelected(song);
            }
            onShowDialog(false);
        },
        [onShowDialog, onSongSelected]
    );

    const onSaveButton = useCallback(
        (song: SongModel) => {
            saveSong(song)
                .then(() => {
                    toast.success('Song added');
                    onShowDialog(false);
                })
                .catch((err) => handleError(err));
        },
        [onShowDialog]
    );

    return (
        <Dialog
            visible={showDialog}
            style={{ width: '90vw' }}
            footer={
                <div>
                    <Button
                        label="Save"
                        icon="pi pi-save"
                        onClick={() => onSaveButton(song)}
                        className="button-secondary float-left"
                    />
                    <Button
                        label="Close"
                        icon="pi pi-times"
                        onClick={() => onDialogHide(false)}
                        className="p-confirm-dialog-reject"
                    />
                    {host && (
                        <Button
                            className="button-primary"
                            label="Select"
                            icon="pi pi-check"
                            onClick={() => onDialogHide(true, song)}
                        />
                    )}
                </div>
            }
            onHide={() => onDialogHide(false)}
            dismissableMask={true}
            showHeader={false}
            focusOnShow={false}
        >
            <Lyrics song={song} />
        </Dialog>
    );
};

export default SongDetailsDialog;
