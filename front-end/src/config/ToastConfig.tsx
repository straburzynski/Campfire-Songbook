import React from 'react';
import { ToastMessageType } from 'primereact/toast';

export const toastConfig = (severity: string, content: string): ToastMessageType => {
    return {
        severity: severity,
        life: 4000,
        closable: true,
        contentClassName: '',
        sticky: false,
        content: (
            <div className="p-flex p-flex-column" style={{ flex: '1' }}>
                <div className="p-text-center">
                    <p>{content}</p>
                </div>
            </div>
        ),
    };
};
