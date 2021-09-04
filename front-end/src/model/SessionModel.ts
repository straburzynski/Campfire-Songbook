import { SongModel } from './SongModel';

export interface SessionModel {
    id?: string;
    song?: SongModel;
    name?: string;
    password?: string;
    temporary?: boolean;
}
