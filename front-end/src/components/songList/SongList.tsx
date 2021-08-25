import React, { useContext, useEffect, useState } from 'react';
import '../../index.css';
import { SongModel } from '../../model/SongModel';
import AppContext from '../../context/AppContext';
import { updateSession } from '../../service/SessionService';

const SongList = (props) => {
    const appContext = useContext(AppContext);

    const [songs, setSongs] = useState<SongModel[]>([]);

    const getSongs = async () => {
        const response = await fetch('http://localhost:8080/songs');
        const data = await response.json();
        setSongs(data);
    };

    useEffect(() => {
        console.log('mount');
        getSongs();
    }, []);
    useEffect(() => console.log('will update song'), [songs]);
    useEffect(() => console.log('will update any'));
    useEffect(() => () => console.log('will update song or unmount'), [songs]);
    useEffect(() => () => console.log('unmount'), []);

    const selectSong = (songId) => {
        if (props.session && props.session.name) {
            appContext.changeSongId(songId);
            handleSessionUpdate(props.session.name, songId);
        }
    };
    const handleSessionUpdate = (sessionName: string, songId: string): void => {
        updateSession(sessionName, songId)
            .then((res) => {
                appContext.changeSongId(res.songId);
            })
            .catch((err) => {
                console.log(err);
            });
        console.log('session song updated', songId);
    };

    return (
        <>
            <pre>{appContext.songId}</pre>
            <ul>
                {songs.map((song) => {
                    return (
                        <li key={song.id}>
                            <div onClick={() => selectSong(song.id)}>
                                {song.author ? song.author : `---`} - {song.title}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default SongList;
