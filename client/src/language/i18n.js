import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en.json';
import translationES from './locales/es.json';
import translationVal from './locales/val.json';

const userLanguage = navigator.language.split('-')[0]; // Obtener el idioma principal del navegador
const fallbackLanguage = 'val'; // Idioma de respaldo

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      es: {
        translation: translationES,
      },
      val: {
        translation: translationVal
      }
    },
    lng: userLanguage || fallbackLanguage, // Utilizar el idioma del usuario o el idioma de respaldo
    fallbackLng: fallbackLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
