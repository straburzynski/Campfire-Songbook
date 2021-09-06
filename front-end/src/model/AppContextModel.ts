import { SongModel } from './SongModel';

export interface AppContextModel {
    song?: SongModel;
    setSong?: any;
    sessionName?: string;
    setSessionName?: any;
    host?: boolean;
    setHost?: any;
    showChords?: boolean;
    setShowChords?: any;
}
