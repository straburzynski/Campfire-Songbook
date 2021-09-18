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

const SongList = ({ onSongSelected }) => {
    const { setSong, sessionName, host } = useContext(AppContext);
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
        handleGetAllSongs();
    }, []);

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
            <div className="app-dialog-buttons">
                <Button
                    label="Close"
                    icon="pi pi-times"
                    onClick={() => onDialogHide(false)}
                    className="p-confirm-dialog-reject"
                />
                {host && (
                    <Button
                        className="p-confirm-dialog-accept"
                        label="Select"
                        icon="pi pi-check"
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

    const SongDetails = () => (
        <>
            <Dialog
                className="song-details-dialog"
                visible={showDialog}
                style={{ width: '90vw' }}
                footer={renderFooter}
                onHide={() => onDialogHide(false)}
                dismissableMask={true}
                showHeader={false}
            >
                <Lyrics song={previewSong} />
            </Dialog>
        </>
    );

    const showSong = (song: SongModel, e) => {
        e.stopPropagation();
        setShowDialog(true);
        setPreviewSong(song);
    };

    const actionColumn = (song: SongModel) => {
        return (
            <Button
                icon="pi pi-search"
                className="p-button-rounded p-button-secondary p-button-outlined"
                onClick={(e) => showSong(song, e)}
            />
        );
    };

    return (
        <>
            <div className="p-d-flex p-jc-end p-mb-2 p-mr-2">
                <div className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="card">
                <DataTable
                    value={songs}
                    sortField="author"
                    sortOrder={1}
                    onRowClick={(row) => selectSong(row.data)}
                    globalFilter={globalFilter}
                    emptyMessage="No songs found."
                >
                    <Column field="author" header="Author" sortable />
                    <Column field="title" header="Title" sortable />
                    <Column header="" body={actionColumn} style={{ width: '100px' }} />
                </DataTable>
            </div>
            <SongDetails />
        </>
    );
};

export default SongList;
