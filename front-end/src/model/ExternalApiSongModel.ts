import { ExternalApiSourceEnum } from './ExternalApiSourceEnum';

export interface ExternalApiSongModel {
    artist: string;
    title: string;
    url: string;
    source: ExternalApiSourceEnum;
}
