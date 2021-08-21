import React, { useEffect, useState } from 'react';
import '../../index.css'
import { SongModel } from '../../model/SongModel';

const SongList = () => {

    const [songs, setSongs] = useState<SongModel[]>([])

    const getSongs = async () => {
        const response = await fetch("http://localhost:8080/songs");
        const data = await response.json();
        setSongs(data);
    }

    useEffect(() => {
        console.log("mount");
        getSongs();
    }, []);
    useEffect(() => console.log("will update song"), [songs]);
    useEffect(() => console.log("will update any"));
    useEffect(() => () => console.log("will update song or unmount"), [songs]);
    useEffect(() => () => console.log("unmount"), []);


    return <>
        <ul>
            {songs.map(song => {
                    return <li key={song.id}>
                        {song.author ? song.author : `---`} - {song.title}
                    </li>
                }
            )}
        </ul>
    </>
}

export default SongList
