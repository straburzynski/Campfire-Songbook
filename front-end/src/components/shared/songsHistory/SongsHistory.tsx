import React, { useState } from 'react';
import { Inplace, InplaceContent, InplaceDisplay } from 'primereact/inplace';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { SongHistoryModel } from '../../../model/SongHistoryModel';
import { formatDate } from '../../../service/DateTimeFormatterService';
import './songsHistory.scss';

interface SubscribeProps {
    songHistoryList: SongHistoryModel[];
}

const SongsHistory = ({ songHistoryList }: SubscribeProps) => {
    const { t } = useTranslation();
    const [songsHistoryActive, setSongsHistoryActive] = useState(false);

    return <>
        {songHistoryList.length > 0 &&
            <Inplace active={songsHistoryActive}
                     onToggle={(e) => setSongsHistoryActive(e.value)}
                     className="songs-history-inplace non-printable">
                <InplaceDisplay>
                    <Button
                        text
                        severity="secondary"
                        label={t('common.show_songs_history')}
                        icon="pi pi-angle-down"
                        iconPos="right"
                    />
                </InplaceDisplay>
                <InplaceContent>
                    <Button
                        text
                        severity="secondary"
                        label={t('common.hide_songs_history')}
                        icon="pi pi-angle-up"
                        iconPos="right"
                        onClick={() => setSongsHistoryActive(!songsHistoryActive)}
                    />
                    <ol>
                        {songHistoryList.map(song =>
                            <li className="text-color-secondary" key={song.timestamp.toISOString()}>
                                {formatDate(song.timestamp)} - {song.author} - {song.title}
                            </li>,
                        )}
                    </ol>
                </InplaceContent>
            </Inplace>
        }
    </>;
};

export default SongsHistory;
