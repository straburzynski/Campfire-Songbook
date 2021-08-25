import API from '../config/ApiConfig';
import { SessionModel } from '../model/SessionModel';
import { AxiosResponse } from 'axios';

export function getSession(sessionName: string): Promise<SessionModel> {
    return API.get(`sessions/${sessionName}`).then((result: AxiosResponse<SessionModel>) => result.data);
}

export function createSession(sessionName: string): Promise<SessionModel> {
    return API.post('sessions/', { name: sessionName }).then((result: AxiosResponse<SessionModel>) => result.data);
}

export function updateSession(sessionName: string, songId: string): Promise<SessionModel> {
    return API.put('sessions/', {
        name: sessionName,
        songId: songId,
    }).then((result: AxiosResponse<SessionModel>) => result.data);
}
