import API from '../config/ApiConfig';
import { AxiosResponse } from 'axios';
import { SongModel } from '../model/SongModel';
import { ExternalApiSongModel } from '../model/ExternalApiSongModel';
import { SessionModel } from '../model/SessionModel';
import { trackPromise } from 'react-promise-tracker';

export function externalApiSearch(songName: string): Promise<ExternalApiSongModel[]> {
    const url = 'external/search?title=' + songName;
    return trackPromise(API.get(url).then((result: AxiosResponse<ExternalApiSongModel[]>) => result.data));
}

export function externalApiGetSong(song: ExternalApiSongModel): Promise<SongModel> {
    return trackPromise(API.post('external/parse', song).then((result: AxiosResponse<SongModel>) => result.data));
}

export function externalApiUpdateSession(song: ExternalApiSongModel, sessionName: string): Promise<SessionModel> {
    return trackPromise(
        API.post('external/updateSession?sessionName=' + sessionName, song).then(
            (result: AxiosResponse<SessionModel>) => result.data
        )
    );
}
