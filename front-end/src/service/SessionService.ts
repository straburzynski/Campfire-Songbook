import API from '../config/ApiConfig';
import { SessionModel } from '../model/SessionModel';
import { AxiosResponse } from 'axios';

export function getSession(sessionName: string): Promise<SessionModel> {
    return API.get(`sessions/${sessionName}`).then((result: AxiosResponse<SessionModel>) => result.data);
}

export function createSession(sessionName: string, password: string): Promise<SessionModel> {
    return API.post('sessions/', {
        name: sessionName,
        password: password,
    }).then((result: AxiosResponse<SessionModel>) => result.data);
}

export function updateSession(session: SessionModel): Promise<SessionModel> {
    return API.put('sessions/', session).then((result: AxiosResponse<SessionModel>) => result.data);
}
