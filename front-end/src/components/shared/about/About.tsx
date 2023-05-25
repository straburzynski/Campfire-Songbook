import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import AppContext from '../../../context/AppContext';
import './about.scss';
import { Divider } from 'primereact/divider';
import { PL } from '../../../translations/i18n/pl';

const About = () => {
    const {} = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className="about-app p-px-5">
            <p>
                <strong>{t('common.version')}</strong>: {Object.keys(PL.changelog).shift()}
            </p>

            <a href="https://github.com/straburzynski/Campfire-Songbook" className="github-link">
                <i className="pi pi-github"></i> Campfire Songbook
            </a>

            <p className="p-mt-5">{t('common.changelog')}:</p>
            <div className="p-field p-grid p-mt-3 changelog">
                {Object.keys(PL.changelog).map((key) => (
                    <div key={key}>
                        <Divider align="left">
                            <div className="inline-flex align-items-center">{key.toString()}</div>
                        </Divider>
                        <p className="p-mb-5 p-text-justify">{t(`changelog.${key}`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;
