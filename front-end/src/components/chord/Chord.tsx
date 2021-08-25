import React from 'react';
import './chord.css';

const Chord = (props) => {
    return <span className="chord">{props.value}</span>;
};

export default Chord;
