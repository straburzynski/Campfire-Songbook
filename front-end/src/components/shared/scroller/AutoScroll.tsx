import React, { useRef, useState } from 'react';
import { AutoScrollSpeedEnum, autoScrollSpeedOptions } from './AutoScrollSpeedEnum';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

const AutoScroll = () => {
    const [running, setRunning] = useState<boolean>(false);
    const speedRef = useRef<number>(AutoScrollSpeedEnum.NORMAL);
    const [speed, setSpeed] = useState<number>(AutoScrollSpeedEnum.NORMAL);
    const autoscrollTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
    const { t } = useTranslation();

    const handleOnStart = () => {
        setRunning(true);
        startScroll();
    };

    const handleOnStop = () => {
        stopScroll();
    };

    const handleSetSpeed = (change: number) => {
        const index = autoScrollSpeedOptions.indexOf(speed);
        const newSpeed = autoScrollSpeedOptions[index + change]
        setSpeed(newSpeed);
        speedRef.current = newSpeed;
    };

    const currentScrollValue = (): number => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return scrollTop + window.innerHeight;
    };

    const pageHeight = (): number => {
        return document.documentElement.scrollHeight || document.body.scrollHeight;
    };

    const startScroll = () => {
        if (currentScrollValue() <= pageHeight() && !running) {
            autoscrollTimeout.current = setTimeout(() => {
                startScroll();
                window.scrollBy(0, Math.abs(1));
            }, speedRef.current);
        } else {
            setRunning(false);
        }
    };

    const stopScroll = () => {
        setRunning(false);
        clearTimeout(autoscrollTimeout.current);
    };

    return (
        <>
            <div id='autoscroll-buttons' className='p-buttonset mx-2 m-2 flex align-items-center justify-content-center'>
                <Button
                    icon='pi pi-minus'
                    onClick={() => handleSetSpeed(-1)}
                    severity='secondary'
                    outlined
                    disabled={speed === AutoScrollSpeedEnum.VERY_SLOW}
                />
                <Button
                    icon={running ? 'pi pi-pause' : 'pi pi-angle-double-down'}
                    onClick={running ? handleOnStop : handleOnStart}
                    severity='secondary'
                    outlined
                    label={t('common.autoscroll')}
                />
                <Button
                    icon='pi pi-plus'
                    onClick={() => handleSetSpeed(1)}
                    severity='secondary'
                    outlined
                    disabled={speed === AutoScrollSpeedEnum.VERY_FAST}
                />
            </div>
        </>
    );
};
export default React.memo(AutoScroll);
