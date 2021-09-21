import API from '../config/ApiConfig';
import { AxiosResponse } from 'axios';
import { SongModel } from '../model/SongModel';
import { trackPromise } from 'react-promise-tracker';

export function getSong(songId: string): Promise<SongModel> {
    const url = 'songs/' + songId;
    return trackPromise(API.get(url).then((result: AxiosResponse<SongModel>) => result.data));
}

export function saveSong(song: SongModel): Promise<void> {
    return trackPromise(API.post('songs', song).then((result: AxiosResponse<void>) => result.data));
}

export function getAllSongs(): Promise<SongModel[]> {
    return trackPromise(API.get('songs').then((result: AxiosResponse<SongModel[]>) => result.data));
}
