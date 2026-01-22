import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import i18n, { dir, use as i18nUse } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import { useAppStore } from '../stores';
import { resources } from './resources';

export * from './resources';
export * from './types';
export * from './utils';

export const DEFAULT_LANGUAGE = 'en';

dayjs.extend(relativeTime);

export const initDayjs = () => {
  const currentLanguage = useAppStore.getState()?.language ?? DEFAULT_LANGUAGE;
  dayjs.locale(currentLanguage);
};

const initI18n = async () => {
  const currentLanguage = useAppStore.getState()?.language ?? DEFAULT_LANGUAGE;

  i18nUse(initReactI18next).init({
    resources,
    lng: currentLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    pluralSeparator: '_',
  });

  initDayjs();
};

initI18n();

// Is it a RTL language?
export const isRTL: boolean = dir() === 'rtl';

I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

export default i18n;
