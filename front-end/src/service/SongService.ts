import API from '../config/ApiConfig';
import { AxiosResponse } from 'axios';
import { SongModel } from '../model/SongModel';

export function getSong(songId: string): Promise<SongModel> {
    const url = 'songs/' + songId;
    console.log(url);
    return API.get(url).then((result: AxiosResponse<SongModel>) => result.data);
}

export function getAllSongs(): Promise<SongModel[]> {
    console.log('getting all songs');
    return API.get('songs').then((result: AxiosResponse<SongModel[]>) => result.data);
}
