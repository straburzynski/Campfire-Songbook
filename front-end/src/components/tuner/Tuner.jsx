import React, { useEffect, useRef, useState } from 'react';
import AudioContext from '../../context/AudioContext';
import './tuner.scss';
import autoCorrelate from './AutoCorrelate';
import { centsOffFromPitch, noteFromPitch } from './tunerHelpers';
import { Badge } from 'primereact/badge';

const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let buf = new Float32Array(2046);

const Tuner = () => {
    const getMicInput = () => {
        return navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                autoGainControl: false,
                noiseSuppression: false,
                latency: 0,
            },
        });
    };

    const source = useRef(null);
    const [pitchNote, setPitchNote] = useState('C');
    const [pitchScale, setPitchScale] = useState(4);
    const [frequency, setFrequency] = useState('--- Hz');
    const [detune, setDetune] = useState(undefined);

    const updatePitch = () => {
        analyserNode.getFloatTimeDomainData(buf);
        const calculatedFrequency = autoCorrelate(buf, audioCtx.sampleRate);
        if (calculatedFrequency > 0) {
            let midiNumber = noteFromPitch(calculatedFrequency);
            let note = notes[midiNumber % 12];
            let pitchClass = Math.floor(midiNumber / 12) - 1;
            let detuneValue = centsOffFromPitch(calculatedFrequency, midiNumber);
            setFrequency(parseFloat(calculatedFrequency).toFixed(2) + ' Hz');
            setPitchNote(note);
            setPitchScale(pitchClass);
            setDetune(detuneValue);
        }
    };

    useEffect(() => {
        const start = async () => {
            const input = await getMicInput();
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }
            source.current = audioCtx.createMediaStreamSource(input);
            source.current.connect(analyserNode);
        };
        start();
        setInterval(updatePitch, 400);
        return () => {
            source.current.disconnect(analyserNode);
        };
    }, []);

    return (
        <div className="tuner-sidebar flex flex-col align-items-center justify-content-center mt-2">
            <div className="flex flex-col items-center tuner-container">
                <div
                    className="w-full flex justify-center items-center flex-column tuner-box"
                    style={{ backgroundColor: Math.abs(detune) < 10 ? '#0bf800' : '#ededed' }}
                >
                    <div className="flex flex-row justify-content-center relative">
                        <div className="note-name">{pitchNote.substring(0, 1)}</div>
                        <Badge value={pitchScale} severity="secondary" size="large" className="pitch-scale"></Badge>
                        <div className="pitch-scale-sharp">{pitchNote.substring(1)}</div>
                    </div>
                    <div>
                        <div className="flex justify-content-center align-items-center detune-gradient mt-5">
                            <span className="tuner-pointer" style={{ left: detune + '%' }}>
                                <i className="pi pi-caret-down text-2xl"></i>
                            </span>
                        </div>
                        <div className="mt-2 w-full text-center font-semibold text-2xl my-3">
                            <span>{detune > 0 ? `+${detune}` : detune < 0 ? detune : '---'}</span>
                        </div>
                        <div className="mt-2 w-full text-center">
                            <span>{frequency}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tuner;
