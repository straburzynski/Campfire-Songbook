import API from '../config/ApiConfig';
import { SessionModel } from '../model/SessionModel';
import { AxiosResponse } from 'axios';
import { trackPromise } from 'react-promise-tracker';

export function getSession(sessionName: string): Promise<SessionModel> {
    return trackPromise(API.get(`sessions/${sessionName}`).then((result: AxiosResponse<SessionModel>) => result.data));
}

export function createSession(sessionName: string, password: string): Promise<SessionModel> {
    return trackPromise(
        API.post('sessions/', {
            name: sessionName,
            password: password,
        }).then((result: AxiosResponse<SessionModel>) => result.data)
    );
}

export function updateSession(session: SessionModel): Promise<SessionModel> {
    return trackPromise(API.put('sessions/', session).then((result: AxiosResponse<SessionModel>) => result.data));
}
