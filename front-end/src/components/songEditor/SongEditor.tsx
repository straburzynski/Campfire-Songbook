import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { SongModel } from '../../model/SongModel';
import { deleteSong, getAllSongs, saveSong } from '../../service/SongService';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { getErrorClassName, getFormErrorMessage } from '../../service/FormService';
import { useTranslation } from 'react-i18next';
import './songEditor.scss';
import { Divider } from 'primereact/divider';
import { confirmDialog } from 'primereact/confirmdialog';

const SongEditor = () => {
    const { t } = useTranslation();
    const [songs, setSongs] = useState<SongModel[]>([]);
    const [selectedSong, setSelectedSong] = useState<SongModel>();

    const emptySongForm = {
        id: '',
        author: '',
        title: '',
        lyrics: '',
    };

    const songForm = useFormik({
        enableReinitialize: true,
        initialValues: selectedSong || emptySongForm,
        validate: (song: SongModel) => {
            let errors: any = {};
            if (!song.author) {
                errors.author = t('editor.author_required');
            }
            if (!song.title) {
                errors.title = t('editor.title_required');
            }
            if (!song.lyrics) {
                errors.lyrics = t('editor.lyrics_required');
            }
            return errors;
        },
        onSubmit: (song) => {
            if (songForm.isValid) {
                saveSong(song)
                    .then(() => {
                        toast.success(t('editor.song_updated'));
                        getAllSongs().then((songs: SongModel[]) => {
                            setSongs(songs);
                            setSelectedSong(song);
                        });
                    })
                    .catch(() => {
                        toast.error(t('exception.cannot_save_song'));
                    });
            }
        },
    });

    useEffect(() => {
        const handleGetAllSongs = async () => {
            getAllSongs().then((songs: SongModel[]) => {
                setSongs(songs);
            });
        };
        handleGetAllSongs();
    }, []);

    const onSongSelect = (event): void => {
        if (event.target.value == null) {
            setSelectedSong(undefined);
        } else {
            const selectedSong = event.target.value as SongModel;
            setSelectedSong(selectedSong);
        }
    };

    const countryOptionTemplate = (song: SongModel) => (
        <div className="ellipsis">
            {song?.author} - {song?.title}
        </div>
    );

    const selectedCountryTemplate = (song: SongModel) => {
        return <div className="ellipsis">{song ? `${song.author} ${song.title}` : t('common.select_song')}</div>;
    };

    const handleDeleteSong = (song: SongModel) => {
        deleteSong(song.id).then(() => {
            toast.success(t('editor.song_deleted'));
            setSelectedSong(undefined);
            getAllSongs().then((songs: SongModel[]) => {
                setSongs(songs);
            });
        });
    };

    const showConfirmationDialog = (song: SongModel) => {
        confirmDialog({
            showHeader: false,
            message: <div className="p-mt-6">{t('dialog.delete_song_confirmation')}</div>,
            accept: () => handleDeleteSong(song),
            rejectLabel: t('common.no'),
            acceptLabel: t('common.yes'),
        });
    };

    return (
        <div className="editor p-p-3">
            <div className="card">
                {songs && (
                    <Dropdown
                        value={selectedSong}
                        options={songs}
                        onChange={onSongSelect}
                        optionLabel={t('common.title')}
                        filter
                        showClear
                        showFilterClear
                        filterBy="title"
                        placeholder={t('common.select_song')}
                        valueTemplate={selectedCountryTemplate}
                        itemTemplate={countryOptionTemplate}
                    />
                )}

                <Divider align="center" type="dashed" className="custom-divider">
                    <p>{t('editor.song_editor')}</p>
                </Divider>

                <form onSubmit={songForm.handleSubmit} className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-6">
                        <span className="p-float-label">
                            <InputText
                                id="author"
                                name="author"
                                value={songForm.values?.author}
                                onChange={songForm.handleChange}
                                autoFocus
                                className={getErrorClassName(songForm, 'author')}
                            />
                            <label htmlFor="author" className={getErrorClassName(songForm, 'author')}>
                                {t('common.author')}
                            </label>
                        </span>
                        {getFormErrorMessage(songForm, 'author')}
                    </div>

                    <div className="p-field p-col-12 p-md-6">
                        <span className="p-float-label">
                            <InputText
                                id="title"
                                name="title"
                                value={songForm.values?.title}
                                onChange={songForm.handleChange}
                                className={getErrorClassName(songForm, 'title')}
                            />
                            <label htmlFor="title" className={getErrorClassName(songForm, 'title')}>
                                {t('common.title')}
                            </label>
                        </span>
                        {getFormErrorMessage(songForm, 'title')}
                    </div>

                    <div className="p-field p-col-12">
                        <span className="p-float-label">
                            <InputTextarea
                                id="lyrics"
                                name="lyrics"
                                value={songForm.values?.lyrics}
                                onChange={songForm.handleChange}
                                className={getErrorClassName(songForm, 'lyrics')}
                                rows={5}
                                cols={30}
                                autoResize
                            />

                            <label htmlFor="lyrics" className={getErrorClassName(songForm, 'lyrics')}>
                                {t('common.lyrics')}
                            </label>
                        </span>
                        {getFormErrorMessage(songForm, 'lyrics')}
                    </div>
                    <div className="p-d-flex p-jc-evenly p-width-100">
                        <div className="p-mr-2">
                            <button
                                disabled={!selectedSong}
                                className="p-button p-component p-button-danger"
                                type="button"
                                onClick={() => showConfirmationDialog(selectedSong!)}
                            >
                                <span className="p-button-icon p-c pi pi-trash p-button-icon-left" />
                                <span className="p-button-label p-c p-d-sm-inline-flex">{t('common.delete')}</span>
                            </button>
                        </div>
                        <div>
                            <button className="p-button p-component button-primary" type="submit">
                                <span className="p-button-icon p-c pi pi-save p-button-icon-left" />
                                <span className="p-button-label p-c p-d-sm-inline-flex">{t('common.save')}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SongEditor;
