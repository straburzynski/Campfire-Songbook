import API from '../config/ApiConfig';
import { SessionModel } from '../model/SessionModel';
import { AxiosResponse } from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { getItemFromLocalStorage, saveItemToLocalStorage } from './LocalStorageService';

const offlineModeOn = () => getItemFromLocalStorage('offlineMode') === 'true';
const getSessionFromStorage = () => {
    const sessionJsonString = getItemFromLocalStorage('session');
    return sessionJsonString ? JSON.parse(sessionJsonString) : null;
};

export function getSession(sessionName: string): Promise<SessionModel> {
    if (offlineModeOn()) {
        return Promise.resolve(getSessionFromStorage()).then((s) => s);
    } else {
        return trackPromise(
            API.get(`sessions/${sessionName}`).then((result: AxiosResponse<SessionModel>) => result.data)
        );
    }
}

export function createSession(sessionName: string, password: string): Promise<SessionModel> {
    if (offlineModeOn()) {
        let session = getSessionFromStorage();
        if (!session) {
            session = { name: sessionName, password: password };
            saveItemToLocalStorage('session', JSON.stringify(session));
        }
        return Promise.resolve(session).then((s) => s);
    } else {
        return trackPromise(
            API.post('sessions/', {
                name: sessionName,
                password: password,
            }).then((result: AxiosResponse<SessionModel>) => result.data)
        );
    }
}

export function updateSession(session: SessionModel): Promise<SessionModel> {
    if (offlineModeOn()) {
        saveItemToLocalStorage('session', JSON.stringify(session));
        return Promise.resolve(session).then((s) => s);
    } else {
        return trackPromise(API.put('sessions/', session).then((result: AxiosResponse<SessionModel>) => result.data));
    }
}
