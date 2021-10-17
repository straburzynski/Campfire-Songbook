import { SongModel } from './SongModel';
import { InstrumentEnum } from './InstrumentEnum';

export interface AppContextModel {
    song?: SongModel;
    setSong?: any;
    sessionName?: string;
    setSessionName?: any;
    host?: boolean;
    setHost?: any;
    instrument?: InstrumentEnum,
    setInstrument?: any;
    fontSize?: number;
    setFontSize?: any;
}
