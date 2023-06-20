import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AudioContext from '../../context/AudioContext';
import './tuner.scss';
import autoCorrelate from './AutoCorrelate';
import { centsOffFromPitch, getDetunePercent, noteFromPitch } from './tunerHelpers';

const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let buf = new Float32Array(2046);

const Tuner = () => {
    const { t } = useTranslation();
    const [source, setSource] = useState(null);
    const [started, setStart] = useState(false);
    const [pitchNote, setPitchNote] = useState('C');
    const [pitchScale, setPitchScale] = useState('4');
    const [pitch, setPitch] = useState('0 Hz');
    const [detune, setDetune] = useState(0);
    const [notification, setNotification] = useState(false);

    const updatePitch = (time) => {
        analyserNode.getFloatTimeDomainData(buf);
        var ac = autoCorrelate(buf, audioCtx.sampleRate);
        if (ac > -1) {
            let note = noteFromPitch(ac);
            let sym = notes[note % 12];
            let scl = Math.floor(note / 12) - 1;
            let dtune = centsOffFromPitch(ac, note);
            setPitch(parseFloat(ac).toFixed(2) + ' Hz');
            setPitchNote(sym);
            setPitchScale(scl);
            setDetune(dtune);
            setNotification(false);
            console.log(note, sym, scl, dtune, ac);
        }
    };

    useEffect(() => {
        if (source != null) {
            source.connect(analyserNode);
        }
    }, [source]);

    setInterval(updatePitch, 1);

    const start = async () => {
        const input = await getMicInput();

        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }
        setStart(true);
        setNotification(true);
        setTimeout(() => setNotification(false), 5000);
        setSource(audioCtx.createMediaStreamSource(input));
    };

    const stop = () => {
        source.disconnect(analyserNode);
        setStart(false);
    };

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

    return (
        <div className="">
            <div className={notification ? 'visible' : 'invisible'}>
                Please, bring your instrument near to the microphone
            </div>
            <div className="">
                <div className={started ? 'visible' : 'invisible'}>
                    <div className="">
                        <span className={started ? 'visible' : 'invisible'}>{pitchNote}</span>
                        <span className="">{pitchScale}</span>
                    </div>

                    <div className="">
                        <div
                            className=""
                            style={{
                                width: (detune < 0 ? getDetunePercent(detune) : '50') + '%',
                            }}
                        ></div>
                        <span className="">I</span>
                        <div
                            className=""
                            style={{
                                width: (detune > 0 ? getDetunePercent(detune) : '50') + '%',
                            }}
                        ></div>
                    </div>
                    <div className="mt-2">
                        <span>{pitch}</span>
                    </div>
                </div>
                {!started ? (
                    <button className="" onClick={start}>
                        Start
                    </button>
                ) : (
                    <button className="" onClick={stop}>
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default Tuner;
