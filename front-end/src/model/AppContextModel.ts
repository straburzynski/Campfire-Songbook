import { SongModel } from './SongModel';

export interface AppContextModel {
    song?: SongModel;
    changeSong?: any;
    sessionName?: string;
    changeSessionName?: any;
    host?: boolean;
    changeHost?: any;
    showChords: boolean;
    changeShowChords: any;
}
