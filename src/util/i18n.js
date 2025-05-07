import i18n from 'i18next';
import en from '../locales/en.json';
import * as RNLocalize from 'react-native-localize';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {translation: en},
};
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    const locales = RNLocalize.getLocales();
    callback(locales.length > 0 ? locales[0].languageCode : 'en');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
