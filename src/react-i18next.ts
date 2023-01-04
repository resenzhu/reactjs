import httpBackend from 'i18next-http-backend';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n.use(httpBackend).use(initReactI18next).init(
{
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'id'],
  ns: 'main.layout',
  defaultNS: 'main.layout',
  cleanCode: true,
  lowerCaseLng: true,
  debug: process.env.NODE_ENV !== 'production'
});

export default i18n;
