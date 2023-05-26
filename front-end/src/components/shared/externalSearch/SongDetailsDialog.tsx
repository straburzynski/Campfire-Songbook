import React, { FC, useCallback } from 'react';
import Lyrics from '../lyrics/Lyrics';
import { Dialog } from 'primereact/dialog';
import { SongModel } from '../../../model/SongModel';
import './songDetailsDialog.scss';
import { createSong } from '../../../service/SongService';
import { toast } from 'react-toastify';
import { handleError } from '../../../service/ExceptionService';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { CustomExceptionModel } from '../../../model/CustomExceptionModel';
import { Button } from 'primereact/button';

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
            createSong(song)
                .then(() => {
                    toast.success(t('dialog.song_added'));
                    onShowDialog(false);
                })
                .catch((err: AxiosError) => {
                    const ex = err.response?.data as CustomExceptionModel;
                    if (ex.params.hasOwnProperty('song')) {
                        toast.warning(t(ex.translationKey, ex.params['song']).toString());
                    } else {
                        handleError(err);
                    }
                });
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
                        className="button-secondary float-left"
                        onClick={() => onSaveButton(song)}
                    />

                    <Button
                        label={t('common.close')}
                        icon="pi pi-times"
                        className='color-primary'
                        text
                        onClick={() => onDialogHide(false)}
                    />

                    {host && (
                        <Button
                            label={t('common.select')}
                            icon="pi pi-check"
                            className="button-primary"
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
