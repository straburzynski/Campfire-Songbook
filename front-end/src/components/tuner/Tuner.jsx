import React, { useEffect, useRef, useState } from 'react';
import AudioContext from '../../context/AudioContext';
import './tuner.scss';
import autoCorrelate from './AutoCorrelate';
import { centsOffFromPitch, getDetunePercent, noteFromPitch } from './tunerHelpers';
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
    const [detune, setDetune] = useState(0);

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
            console.log(note, pitchClass, detuneValue, calculatedFrequency);
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
        return () => {
            source.current.disconnect(analyserNode);
        };
    }, []);

    setInterval(updatePitch, 10);

    return (
        <div className="flex flex-col align-items-center justify-content-center h-full">
            <div className="flex flex-col items-center tuner-container">
                <div className="w-full flex justify-center items-center flex-column tuner-box">
                    <div className="flex flex-row justify-content-center">
                        <div className="text-8xl">{pitchNote}</div>
                        <Badge value={pitchScale} severity="secondary"></Badge>
                    </div>
                    <div>
                        <div className="flex justify-content-center align-items-center detune-gradient">
                            <div
                                style={{
                                    width: (detune < 0 ? getDetunePercent(detune) : '50') + '%',
                                }}
                            ></div>
                            <span className="">I</span>
                            <div
                                style={{
                                    width: (detune > 0 ? getDetunePercent(detune) : '50') + '%',
                                }}
                            ></div>
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
