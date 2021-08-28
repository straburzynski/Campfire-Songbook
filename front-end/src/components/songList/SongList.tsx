import React, { useContext, useEffect, useState } from 'react';
import { SongModel } from '../../model/SongModel';
import AppContext from '../../context/AppContext';
import { updateSession } from '../../service/SessionService';
import { getAllSongs } from '../../service/SongService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SessionModel } from '../../model/SessionModel';
import { InputText } from 'primereact/inputtext';

const SongList = () => {
    const appContext = useContext(AppContext);
    const [songs, setSongs] = useState<SongModel[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const handleGetAllSongs = async () => {
        getAllSongs().then((res: SongModel[]) => {
            setSongs(res);
        });
    };

    useEffect(() => {
        handleGetAllSongs();
    }, []);
    // useEffect(() => console.log('will update song'), [songs]);
    // useEffect(() => console.log('will update any'));
    // useEffect(() => () => console.log('will update song or unmount'), [songs]);
    // useEffect(() => () => console.log('unmount'), []);

    const selectSong = (song: SongModel) => {
        if (song.id && appContext.host && appContext.sessionName) {
            appContext.changeSongId(song.id);
            handleSessionUpdate(appContext.sessionName, song.id);
        }
    };
    const handleSessionUpdate = (sessionName: string, songId: string): void => {
        updateSession(sessionName, songId)
            .then((res: SessionModel) => {
                appContext.changeSongId(res.songId);
            })
            .catch((err) => {
                console.log(err);
            });
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
                </DataTable>
            </div>
        </>
    );
};

export default SongList;
