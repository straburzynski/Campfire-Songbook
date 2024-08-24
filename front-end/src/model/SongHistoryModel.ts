import { SongModel } from './SongModel';

export interface SongHistoryModel extends SongModel {
    timestamp: Date;
}