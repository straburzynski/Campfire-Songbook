import API from '../config/ApiConfig';
import { AxiosResponse } from 'axios';
import { SongModel } from '../model/SongModel';
import { trackPromise } from 'react-promise-tracker';
import { getItemFromLocalStorage } from './LocalStorageService';

const offlineModeOn = () => getItemFromLocalStorage('offlineMode') === 'true';

const getSongsFromStorage = () => {
    const songJsonString = getItemFromLocalStorage('songs');
    return songJsonString ? (JSON.parse(songJsonString) as SongModel[]) : [];
};

export function getSong(songId: string): Promise<SongModel> {
    if (offlineModeOn()) {
        const song = getSongsFromStorage().find((song) => song.id === songId);
        return Promise.resolve(song!!).then((s) => s);
    } else {
        const url = 'songs/' + songId;
        return trackPromise(API.get(url).then((result: AxiosResponse<SongModel>) => result.data));
    }
}

export function saveSong(song: SongModel): Promise<SongModel> {
    return song.id ? updateSong(song) : createSong(song);
}

export function createSong(song: SongModel): Promise<SongModel> {
    return trackPromise(API.post('songs', song).then((result: AxiosResponse<SongModel>) => result.data));
}

export function updateSong(song: SongModel): Promise<SongModel> {
    return trackPromise(API.put('songs/' + song.id, song).then((result: AxiosResponse<SongModel>) => result.data));
}

export function deleteSong(id: string): Promise<void> {
    return trackPromise(API.delete('songs/' + id).then((result: AxiosResponse<void>) => result.data));
}

export function getAllSongs(offline: boolean = false): Promise<SongModel[]> {
    if (offlineModeOn()) {
        return Promise.resolve(getSongsFromStorage()).then((s) => s);
    } else {
        return trackPromise(
            API.get(`songs?offline=${offline}`).then((result: AxiosResponse<SongModel[]>) => result.data)
        );
    }
}
