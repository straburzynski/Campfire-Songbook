import React, { useContext, useEffect, useState } from 'react';
import '../../index.css';
import { SongModel } from '../../model/SongModel';
import AppContext from '../../context/AppContext';
import API from '../../config/ApiConfig';
import { SessionModel } from '../../model/SessionModel';

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
            updateSession(props.session.name, songId);
        }
    };
    const updateSession = async (sessionName: string, songId: string) => {
        API.put('sessions/', { name: sessionName, songId: songId })
            .then((res) => {
                const session: SessionModel = res.data;
                appContext.changeSongId(session.songId);
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

export default SongList
