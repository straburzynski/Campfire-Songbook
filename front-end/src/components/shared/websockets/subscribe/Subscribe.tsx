import { useSubscription } from 'react-stomp-hooks';
import { TOPIC } from '../../../../config/WebSocketConfig';
import { SongModel } from '../../../../model/SongModel';
import { useState } from 'react';
import SongsHistory from '../../songsHistory/SongsHistory';
import { SongHistoryModel } from '../../../../model/SongHistoryModel';

interface SubscribeProps {
    sessionName: string,
    onMessageReceived: (song: SongModel) => void
}

const Subscribe = ({ sessionName, onMessageReceived }: SubscribeProps) => {

    const [messages, setMessages] = useState<SongHistoryModel[]>([]);

    useSubscription(TOPIC + sessionName, (message) => {
        const song = JSON.parse(message.body);
        const songWithTimestamp = {
            ...song,
            timestamp: new Date()
        }
        setMessages([songWithTimestamp, ...messages]);
        console.log({...song, timestamp: new Date()})
        onMessageReceived(song);
    });

    return <SongsHistory songHistoryList={messages} />;
};

export default Subscribe;
