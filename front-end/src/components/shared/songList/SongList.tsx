import React, { useContext, useEffect, useState } from 'react';
import { SongModel } from '../../../model/SongModel';
import AppContext from '../../../context/AppContext';
import { updateSession } from '../../../service/SessionService';
import { getAllSongs } from '../../../service/SongService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SessionModel } from '../../../model/SessionModel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Lyrics from '../lyrics/Lyrics';
import './songList.scss';
import { useTranslation } from 'react-i18next';
import { getItemFromLocalStorage, saveItemToLocalStorage } from '../../../service/LocalStorageService';
import { SongsSourceEnum } from '../../../model/SongsSourceEnum';

interface SongListProps {
    source: SongsSourceEnum;
    onSongSelected: () => void;
}

const SongList = ({ source, onSongSelected }: SongListProps) => {
    const { setSong, sessionName, host } = useContext(AppContext);
    const { t } = useTranslation();

    const [songs, setSongs] = useState<SongModel[]>([]);
    const [previewSong, setPreviewSong] = useState<SongModel>();
    const [globalFilter, setGlobalFilter] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        const handleGetAllSongs = async () => {
            getAllSongs().then((res: SongModel[]) => {
                setSongs(res);
            });
        };
        const handleGetFavoriteSongs = () => {
            const json = getItemFromLocalStorage('favoriteSongs') || '[]';
            const favoriteSongs: SongModel[] = JSON.parse(json);
            setSongs(favoriteSongs);
        };
        switch (source) {
            case SongsSourceEnum.DATABASE:
                handleGetAllSongs();
                break;
            case SongsSourceEnum.LOCALSTORAGE:
                handleGetFavoriteSongs();
                break;
        }
    }, [source]);

    const selectSong = (song: SongModel): void => {
        if (song.id && host && sessionName) {
            setSong(song);
            onSongSelected();
            const session: SessionModel = {
                name: sessionName,
                temporary: false,
                song: song,
            };
            handleSessionUpdate(session);
        }
    };

    const handleSessionUpdate = (session: SessionModel): void => {
        updateSession(session)
            .then((res: SessionModel) => {
                setSong(res.song);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const renderFooter = () => {
        return (
            <div className='app-dialog-buttons'>
                {host && source === SongsSourceEnum.LOCALSTORAGE && (
                    <Button
                        label={t('common.remove')}
                        icon='pi pi-heart'
                        className='p-button-secondary p-button-outlined p-text-left'
                        onClick={(e) => onFavRemove()}
                    />
                )}
                {host && source === SongsSourceEnum.DATABASE && (
                    <Button
                        label={t('common.add')}
                        icon='pi pi-heart'
                        className='p-button-secondary p-button-outlined'
                        onClick={(e) => onFavAdd()}
                    />
                )}
                <Button
                    label={t('common.close')}
                    icon='pi pi-times'
                    onClick={() => onDialogHide(false)}
                    className='p-confirm-dialog-reject'
                />
                {host && (
                    <Button
                        className='p-confirm-dialog-accept'
                        label={t('common.select')}
                        icon='pi pi-check'
                        onClick={() => onDialogHide(true)}
                        autoFocus
                    />
                )}
            </div>
        );
    };

    const onDialogHide = (selected: boolean): void => {
        setShowDialog(false);
        if (selected && previewSong) {
            selectSong(previewSong);
        }
        setPreviewSong(undefined);
    };

    const onFavAdd = (): void => {
        setShowDialog(false);
        const allFavorites: SongModel[] = JSON.parse(getItemFromLocalStorage('favoriteSongs') || '[]');
        const updatedFavorites = [...allFavorites.filter((song) => song.id !== previewSong?.id), previewSong];
        saveItemToLocalStorage('favoriteSongs', JSON.stringify(updatedFavorites));
    };

    const onFavRemove = (): void => {
        setShowDialog(false);
        const allFavorites: SongModel[] = JSON.parse(getItemFromLocalStorage('favoriteSongs') || '[]');
        const updatedFavorites = [...allFavorites.filter((song) => song.id !== previewSong?.id)];
        saveItemToLocalStorage('favoriteSongs', JSON.stringify(updatedFavorites));
        setSongs(updatedFavorites);
    };

    const SongDetails = () => (
        <Dialog
            className='song-details-dialog'
            visible={showDialog}
            style={{ width: '90vw' }}
            footer={renderFooter}
            onHide={() => onDialogHide(false)}
            dismissableMask={true}
            showHeader={false}
            focusOnShow={false}
        >
            <Lyrics song={previewSong} />
        </Dialog>
    );

    const showSong = (song: SongModel, e) => {
        e.stopPropagation();
        setShowDialog(true);
        setPreviewSong(song);
    };

    const actionColumn = (song: SongModel) => {
        return (
            <Button
                icon='pi pi-search'
                className='p-button-rounded p-button-secondary p-button-outlined'
                onClick={(e) => showSong(song, e)}
            />
        );
    };

    return (
        <>
            <div className='p-d-flex p-jc-end p-mb-2 p-mr-2'>
                <div className='p-input-icon-left'>
                    <i className='pi pi-search' />
                    <InputText
                        className='custom-input'
                        type='search'
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={t('common.search')}
                    />
                </div>
            </div>
            <div className='card'>
                <DataTable
                    className='song-list-table'
                    value={songs}
                    sortField='author'
                    sortOrder={1}
                    onRowClick={(row) => selectSong(row.data)}
                    globalFilter={globalFilter}
                    emptyMessage={t('exception.no_songs_found')}
                >
                    <Column field='author' header={t('common.author')} sortable />
                    <Column field='title' header={t('common.title')} sortable />
                    <Column header='' body={actionColumn} style={{ width: '100px' }} />
                </DataTable>
            </div>
            <SongDetails />
        </>
    );
};

export default SongList;
