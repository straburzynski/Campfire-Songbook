import { useSubscription } from 'react-stomp-hooks';
import { TOPIC } from '../../../../config/WebSocketConfig';
import { SongModel } from '../../../../model/SongModel';

interface SubscribeProps {
    sessionName: string,
    onMessageReceived: (song: SongModel) => void
}

const Subscribe = ({ sessionName, onMessageReceived }: SubscribeProps) => {
    useSubscription(TOPIC + sessionName, (message) => {
        const song = JSON.parse(message.body);
        onMessageReceived(song);
    });
    return null;
};

export default Subscribe;
