import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: "Welcome to the CultureFit WebSite!",
        },
      },
      es: {
        translation: {
          welcome: "¡Bienvenido a la pagina web de CultureFit!",
        },
      }
    },
  });

export default i18n