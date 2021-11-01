import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { PL } from './i18n/pl';
import { EN } from './i18n/en';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: EN,
            },
            pl: {
                translation: PL,
            },
        },
    });
