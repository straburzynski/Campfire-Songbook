import React from 'react';

export default function Host(props) {
    return <>
        <pre>{props.sessionName}</pre>
        <h2>Select song</h2>
        <p>song list</p>
        <hr/>
        <h2>Selected song</h2>
        <p>lyrics with chords</p>
    </>;
}
