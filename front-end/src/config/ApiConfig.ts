import axios from 'axios';
import EnvConfig from './EnvConfig';

declare module 'axios' {
    export interface AxiosResponse<T = any> extends Promise<T> {}
}

const API = axios.create({
    baseURL: EnvConfig.url,
});

export default API;
