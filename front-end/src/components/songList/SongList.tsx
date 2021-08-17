import React, { useEffect, useState } from 'react';
import '../../index.css'
import { SongModel } from '../../model/SongModel';

const SongList = () => {
    const [songs, setSongs] = useState<SongModel[]>([])

    useEffect(() => {
        console.log('useEffect fire');

        getSongs().then(r => console.log(r));
    }, [])

    const getSongs = async () => {
        const response = await fetch("http://localhost:8080/songs");
        const data = await response.json();
        setSongs(data);
    }

    return <div>
        <ul>
            {songs.map(song => {
                    return <li key={song.id}>
                        {song.author ? song.author : `--- - ${song.title}`}
                    </li>
                }
            )}
        </ul>
    </div>
}

export default SongList
