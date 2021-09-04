import API from '../config/ApiConfig';
import { AxiosResponse } from 'axios';
import { SongModel } from '../model/SongModel';
import { ExternalApiSongModel } from '../model/ExternalApiSongModel';
import { SessionModel } from '../model/SessionModel';

export function externalApiSearch(songName: string): Promise<ExternalApiSongModel[]> {
    const url = 'external/search?title=' + songName;
    return API.get(url).then((result: AxiosResponse<ExternalApiSongModel[]>) => result.data);
}

export function externalApiGetSong(song: ExternalApiSongModel): Promise<SongModel> {
    return API.post('external/parse', song).then((result: AxiosResponse<SongModel>) => result.data);
}

export function externalApiUpdateSession(song: ExternalApiSongModel, sessionName: string): Promise<SessionModel> {
    return API.post('external/updateSession?sessionName=' + sessionName, song).then(
        (result: AxiosResponse<SessionModel>) => result.data
    );
}
