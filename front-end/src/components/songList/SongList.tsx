import React, { useContext, useEffect, useState } from 'react';
import { SongModel } from '../../model/SongModel';
import AppContext from '../../context/AppContext';
import { updateSession } from '../../service/SessionService';
import { getAllSongs } from '../../service/SongService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SessionModel } from '../../model/SessionModel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Lyrics from '../lyrics/Lyrics';

const SongList = ({ onSongSelected }) => {
    const appContext = useContext(AppContext);
    const [songs, setSongs] = useState<SongModel[]>([]);
    const [song, setSong] = useState<SongModel>();
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

    const selectSong = (song: SongModel) => {
        if (song.id && appContext.host && appContext.sessionName) {
            appContext.changeSong(song);
            onSongSelected();
            const session: SessionModel = {
                name: appContext.sessionName,
                temporary: false,
                song: song,
            };
            handleSessionUpdate(session);
        }
    };

    const handleSessionUpdate = (session: SessionModel): void => {
        updateSession(session)
            .then((res: SessionModel) => {
                appContext.changeSong(res.song);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const renderFooter = () => {
        return (
            <div>
                <Button
                    label="Close"
                    icon="pi pi-times"
                    onClick={() => onDialogHide(false)}
                    className="p-button-text"
                />
                {appContext.host && (
                    <Button label="Select" icon="pi pi-check" onClick={() => onDialogHide(true)} autoFocus />
                )}
            </div>
        );
    };

    const onDialogHide = (selected: boolean) => {
        setShowDialog(false);
        if (selected && song) {
            selectSong(song);
        }
        setSong(undefined);
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
                <Lyrics song={song} />
            </Dialog>
        </>
    );

    const showSong = (song: SongModel, e) => {
        e.stopPropagation();
        setShowDialog(true);
        setSong(song);
    };

    const actionColumn = (song: SongModel) => {
        return (
            <Button
                icon="pi pi-search"
                className="p-button-rounded p-button-success p-button-outlined"
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
                    <Column field="author" header="author" sortable />
                    <Column field="title" header="title" sortable />
                    <Column header="action" body={actionColumn} style={{ width: '100px' }} />
                </DataTable>
            </div>
            <SongDetails />
        </>
    );
};

export default SongList;