import React, { FC, useCallback } from 'react';
import Lyrics from '../lyrics/Lyrics';
import { Dialog } from 'primereact/dialog';
import { SongModel } from '../../../model/SongModel';
import './songDetailsDialog.scss';
import { saveSong } from '../../../service/SongService';
import { toast } from 'react-toastify';
import { handleError } from '../../../service/ExceptionService';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { CustomExceptionModel } from '../../../model/CustomExceptionModel';

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
                .catch((err: AxiosError) => {
                    const ex = err.response?.data as CustomExceptionModel;
                    if (ex.params.hasOwnProperty('song')) {
                        toast.warning(t(ex.translationKey, ex.params['song']));
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
                    <button
                        className="p-button p-component button-secondary float-left"
                        onClick={() => onSaveButton(song)}
                    >
                        <span className="p-button-icon p-c pi pi-save p-button-icon-left" />
                        <span className="p-button-label p-c p-d-none p-d-sm-inline-flex">{t('common.save')}</span>
                    </button>

                    <button
                        className="p-button p-component p-confirm-dialog-reject"
                        onClick={() => onDialogHide(false)}
                    >
                        <span className="p-button-icon p-c pi pi-times p-button-icon-left" />
                        <span className="p-button-label p-c p-d-none p-d-sm-inline-flex">{t('common.close')}</span>
                    </button>

                    {host && (
                        <button
                            className="p-button p-component button-primary"
                            onClick={() => onDialogHide(true, song)}
                        >
                            <span className="p-button-icon p-c pi pi-check p-button-icon-left" />
                            <span className="p-button-label p-c">{t('common.select')}</span>
                        </button>
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
