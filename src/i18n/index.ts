import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      dashboard: {
        title: 'Tableau de bord',
        alerts: 'Alertes',
        herds: 'Troupeaux',
        animals: 'Animaux',
      },
    },
  },
  bm: {
    translation: {
      dashboard: {
        title: 'Baarakɛ yɔrɔ',
        alerts: 'Kɔlɔsiliw',
        herds: 'Bagankuruw',
        animals: 'Baganw',
      },
    },
  },
  ff: {
    translation: {
      dashboard: {
        title: 'Alluwal',
        alerts: 'Jeertine',
        herds: 'Coggal',
        animals: 'Daabaaji',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;