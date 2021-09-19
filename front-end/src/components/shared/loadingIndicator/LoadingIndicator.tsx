import { usePromiseTracker } from 'react-promise-tracker';
import React from 'react';
import './loadingIndicator.scss';

export const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        promiseInProgress && (
            <div className="app-loader">
                <div className='loader'/>
            </div>
        )
    );
};
