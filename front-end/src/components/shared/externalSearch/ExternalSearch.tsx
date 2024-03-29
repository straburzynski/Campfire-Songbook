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
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { CustomExceptionModel } from '../../../model/CustomExceptionModel';
import { handleError } from '../../../service/ExceptionService';
import { ExternalApiSourceEnum } from '../../../model/ExternalApiSourceEnum';
import spiewnikWywrotaLogo from '../../../resources/images/spiewnik-wywrota.png';
import ultimateGuitarLogo from '../../../resources/images/ultimate-guitar.png';

const ExternalSearch = ({ onSongSelected }) => {
    const { setSong, host, sessionName } = useContext(AppContext);
    const { t } = useTranslation();
    const [songs, setSongs] = useState<ExternalApiSongModel[]>([]);
    const [query, setQuery] = useState<string>('');
    const [showDialog, setShowDialog] = useState(false);
    const [temporarySong, setTemporarySong] = useState<SongModel>();

    const handleSearchButton = () => {
        if (query === '') {
            toast.warning(t('exception.enter_song_name'));
            return;
        }
        externalApiSearch(query)
            .then((res: ExternalApiSongModel[]) => setSongs(res))
            .catch((err: AxiosError) => {
                const ex = err.response?.data as CustomExceptionModel;
                if (ex.params.hasOwnProperty('message')) {
                    toast.error(t(ex.translationKey, { message: ex.params['message'] }));
                } else {
                    handleError(err);
                }
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
                severity='secondary'
                outlined
                rounded
                onClick={(e) => showSongDetails(song, e)}
            />
        );
    };

    const sourceColumn = (song: ExternalApiSongModel) => {
        switch (song.source) {
            case ExternalApiSourceEnum.SPIEWNIK_WYWROTA:
                return <img alt="Spiewnik Wywrota" src={spiewnikWywrotaLogo} height="40" />
            case ExternalApiSourceEnum.ULTIMATE_GUITAR:
                return <img alt="Ultimate-Guitar" src={ultimateGuitarLogo} height="40" />
        }
    };

    const handleOnRowClick = (song: ExternalApiSongModel) => {
        if (host) {
            externalApiUpdateSession(song, sessionName as string)
                .then((session) => {
                    setSong(session.song);
                    onSongSelected();
                })
                .catch((err) => {
                    toast.error(t('exception.external_api_exception'));
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
            <div className="flex justify-content-end mb-2 mr-2">
                <div className="grid justify-content-center">
                    <div className="col-12">
                        <form onSubmit={(event) => handleOnSubmit(event)} className="p-inputgroup">
                            <InputText
                                className="custom-input"
                                type="search"
                                value={query}
                                onChange={handleOnChange}
                                placeholder={t('common.search_by_title')}
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
                        onRowClick={(row) => handleOnRowClick(row.data as ExternalApiSongModel)}
                    >
                        <Column field="artist" header={t('common.author')} sortable />
                        <Column field="title" header={t('common.title')} sortable />
                        <Column field="source" header="" body={sourceColumn} style={{ width: '70px' }} />
                        <Column header="" body={actionColumn} style={{ width: '70px' }} />
                    </DataTable>
                ) : (
                    <p className="text-center">{t('exception.no_songs_found')}</p>
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
