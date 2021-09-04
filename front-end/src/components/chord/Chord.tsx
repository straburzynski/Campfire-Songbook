import React from 'react';
import './chord.css';

const Chord = (props) => {
    return <span className={props.chordPosition}>{props.chordName}</span>;
};

export default Chord;
