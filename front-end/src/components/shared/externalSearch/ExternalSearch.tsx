import React, { useCallback, useContext, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SessionModel } from '../../../model/SessionModel';
import { ExternalApiSongModel } from '../../../model/ExternalApiSongModel';
import {
    externalApiGetSong,
    externalApiSearch,
    externalApiUpdateSession,
} from '../../../service/ExternalApiSongService';
import { Button } from 'primereact/button';
import { SongModel } from '../../../model/SongModel';
import { updateSession } from '../../../service/SessionService';
import SongDetailsDialog from './SongDetailsDialog';
import { InputText } from 'primereact/inputtext';
import './externalSearch.scss';
import { toast } from 'react-toastify';

const ExternalSearch = ({ onSongSelected }) => {
    const { setSong, host, sessionName } = useContext(AppContext);
    const [songs, setSongs] = useState<ExternalApiSongModel[]>([]);
    const [query, setQuery] = useState<string>('');
    const [showDialog, setShowDialog] = useState(false);
    const [temporarySong, setTemporarySong] = useState<SongModel>();

    const handleSearchButton = () => {
        externalApiSearch(query).then((res: ExternalApiSongModel[]) => {
            setSongs(res);
        });
    };
    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleSearchButton();
    };

    const actionColumn = (song: ExternalApiSongModel) => {
        return (
            <Button
                icon="pi pi-search"
                className="p-button-rounded p-button-secondary p-button-outlined"
                onClick={(e) => showSongDetails(song, e)}
            />
        );
    };

    const handleOnRowClick = (song: ExternalApiSongModel) => {
        if (host) {
            externalApiUpdateSession(song, sessionName as string)
                .then((session) => {
                    setSong(session.song);
                    onSongSelected();
                })
                .catch((err) => {
                    toast.error('Error searching external API');
                    console.log(err);
                });
        }
    };

    const selectSong = useCallback((song: SongModel) => {
        if (host && sessionName) {
            setSong(song);
            onSongSelected();
            const session: SessionModel = {
                name: sessionName,
                temporary: true,
                song: song,
            };
            handleSessionUpdate(session);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSessionUpdate = (session: SessionModel): void => {
        updateSession(session)
            .then((res: SessionModel) => {
                setSong(res.song);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const showSongDetails = (song: ExternalApiSongModel, e) => {
        e.stopPropagation();

        externalApiGetSong(song)
            .then((res: SongModel) => {
                setTemporarySong(res);
                setShowDialog(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onShowDialog = useCallback(
        (dialogVisibility: boolean) => {
            setShowDialog(dialogVisibility);
        },
        [setShowDialog]
    );

    const handleOnChange = useCallback(
        (e) => {
            setQuery(e.target.value);
        },
        [setQuery]
    );

    return (
        <>
            <div className="p-d-flex p-jc-end p-mb-2 p-mr-2">
                <div className="p-grid p-justify-center">
                    <div className="p-col-12">
                        <form onSubmit={(event) => handleOnSubmit(event)} className="p-inputgroup">
                            <InputText
                                className="custom-input"
                                type="search"
                                value={query}
                                onChange={handleOnChange}
                                placeholder="Search"
                            />
                            <Button
                                type="button"
                                onClick={handleSearchButton}
                                icon="pi pi-search"
                                className="button-primary"
                            />
                        </form>
                    </div>
                </div>
            </div>
            <div className="card">
                {songs.length > 0 ? (
                    <DataTable
                        value={songs}
                        sortField="artist"
                        sortOrder={1}
                        onRowClick={(row) => handleOnRowClick(row.data)}
                    >
                        <Column field="artist" header="Author" sortable />
                        <Column field="title" header="Title" sortable />
                        <Column header="" body={actionColumn} style={{ width: '100px' }} />
                    </DataTable>
                ) : (
                    <p className="p-text-center">No songs found.</p>
                )}
            </div>
            {temporarySong && (
                <SongDetailsDialog
                    song={temporarySong}
                    host={host}
                    showDialog={showDialog}
                    onSongSelected={selectSong}
                    onShowDialog={onShowDialog}
                />
            )}
        </>
    );
};

export default ExternalSearch;
