import React from 'react';
import { useTranslation } from 'react-i18next';
import './about.scss';
import { Divider } from 'primereact/divider';
import { PL } from '../../../translations/i18n/pl';
import { APP_NAME } from '../../../config/AppConfig';

const About = () => {
    const { t } = useTranslation();

    return (
        <div className="about-app px-5">
            <p>
                <strong>{t('common.version')}</strong>: {Object.keys(PL.changelog).shift()}
            </p>

            <a href="https://github.com/straburzynski/Campfire-Songbook" className="github-link">
                <i className="pi pi-github"></i> {APP_NAME}
            </a>

            <p className="mt-5">{t('common.changelog')}:</p>
            <div className="field grid mt-3 changelog">
                {Object.keys(PL.changelog).map((key) => (
                    <div key={key}>
                        <Divider align="left">
                            <div className="inline-flex align-items-center">{key.toString()}</div>
                        </Divider>
                        <p className="mb-5 text-justify">{t(`changelog.${key}`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;
