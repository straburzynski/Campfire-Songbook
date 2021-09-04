import API from '../config/ApiConfig';
import { AxiosResponse } from 'axios';
import { SongModel } from '../model/SongModel';

export function getSong(songId: string): Promise<SongModel> {
    const url = 'songs/' + songId;
    return API.get(url).then((result: AxiosResponse<SongModel>) => result.data);
}

export function getAllSongs(): Promise<SongModel[]> {
    return API.get('songs').then((result: AxiosResponse<SongModel[]>) => result.data);
}
