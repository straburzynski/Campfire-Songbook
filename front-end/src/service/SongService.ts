import API from '../config/ApiConfig';
import { AxiosResponse } from 'axios';
import { SongModel } from '../model/SongModel';

export function getSong(songId: string): Promise<SongModel> {
    return API.get('songs/' + songId).then((result: AxiosResponse<SongModel>) => result.data);
}
