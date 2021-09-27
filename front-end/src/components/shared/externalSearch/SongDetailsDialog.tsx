import React, { FC, useCallback } from 'react';
import { Button } from 'primereact/button';
import Lyrics from '../lyrics/Lyrics';
import { Dialog } from 'primereact/dialog';
import { SongModel } from '../../../model/SongModel';
import './songDetailsDialog.scss';
import { saveSong } from '../../../service/SongService';
import { toast } from 'react-toastify';
import { handleError } from '../../../service/ExceptionService';
import { useTranslation } from 'react-i18next';

interface SongDetailsDialogModel {
    song: SongModel;
    host?: boolean;
    showDialog?: boolean;
    onSongSelected: Function;
    onShowDialog: Function;
}

const SongDetailsDialog: FC<SongDetailsDialogModel> = ({ song, host, showDialog, onSongSelected, onShowDialog }) => {
    const { t } = useTranslation();

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
                    toast.success(t('dialog.song_added'));
                    onShowDialog(false);
                })
                .catch((err) => handleError(err));
        },
        [onShowDialog, t]
    );

    return (
        <Dialog
            visible={showDialog}
            style={{ width: '90vw' }}
            footer={
                <div>
                    <Button
                        label={t('common.save')}
                        icon="pi pi-save"
                        onClick={() => onSaveButton(song)}
                        className="button-secondary float-left"
                    />
                    <Button
                        label={t('common.close')}
                        icon="pi pi-times"
                        onClick={() => onDialogHide(false)}
                        className="p-confirm-dialog-reject"
                    />
                    {host && (
                        <Button
                            className="button-primary"
                            label={t('common.select')}
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
