import React, { useRef, useState } from 'react';
import { AutoScrollSpeedEnum } from './AutoScrollSpeedEnum';
import './autoScroll.scss';

const AutoScroll = () => {

    const [running, setRunning] = useState<boolean>(false);
    const speed = useRef<number>(100);
    const autoscrollTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

    const handleOnStart = () => {

        const a = Object.keys(AutoScrollSpeedEnum);
        a.slice(a.length / 2)
        console.log('handle start');
        setRunning(true);
        startScroll();
    };

    const handleOnStop = () => {
        console.log('handle stop');
        stopScroll();
    };

    const handleSetSpeed = (speedChange) => {
        speed.current = speed.current + speedChange;
        console.log(speed.current);
    };

    const scrollTop = () => {
        const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // console.log(currentScrollTop);
        return currentScrollTop;
    };

    const startScroll = () => {
        if (scrollTop() > 0 && !running) {
            console.log(speed.current);
            autoscrollTimeout.current = setTimeout(() => {
                startScroll();
                window.scrollBy(0, -Math.abs(1));
            }, speed.current);
        } else {
            setRunning(false);
        }
    };

    const stopScroll = () => {
        setRunning(false);
        clearTimeout(autoscrollTimeout.current);
    };

    return (
        <div id='autoscroll-buttons'>
            <button onClick={() => handleSetSpeed(-30)}>-</button>
            {running && (<button onClick={handleOnStop}>stop</button>)}
            {!running && (<button onClick={handleOnStart}>start</button>)}
            <button onClick={() => handleSetSpeed(30)}>+</button>
        </div>
    );
};
export default React.memo(AutoScroll);
