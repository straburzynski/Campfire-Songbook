import { trackPromise } from 'react-promise-tracker';
import API from '../config/ApiConfig';
import { AxiosResponse } from 'axios';
import EnvConfig from '../config/EnvConfig';

const apiKey: string = EnvConfig.youtubeApiKey || '';
const urlBase: string = 'https://www.googleapis.com/youtube/v3/search';
const urlVideo: string = 'https://youtube.com/watch?v=';

const urlBuilder = (query: string, maxResults: number = 1): string => {
    let url = new URL(urlBase);
    url.searchParams.append('type', 'video');
    url.searchParams.append('maxResults', String(maxResults));
    url.searchParams.append('key', apiKey);
    url.searchParams.append('q', query);
    return url.toString();
};

export function getYoutubeUrl(videoId: string): string {
    return `${urlVideo}${videoId}`;
}

export const getResultList = (keyword: string): Promise<any> => {
    const url = urlBuilder(keyword);
    return trackPromise(API.get(url).then((result: AxiosResponse<any>) => result.data));
};
