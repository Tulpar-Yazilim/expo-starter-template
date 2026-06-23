import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import * as Localization from 'expo-localization';
import i18n, { dir, use as initI18nUse } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import { useAppStore } from '../stores/app-store';
import { type Language, resources } from './resources';
import { translate } from './utils';

export * from './resources';
export * from './types';
export * from './utils';

export const DEFAULT_LANGUAGE: Language = 'en';
const SUPPORTED_LANGUAGES = Object.keys(resources) as Array<Language>;

function detectDeviceLanguage(): Language {
  const locales = Localization.getLocales();
  const code = locales?.[0]?.languageCode?.toLowerCase() ?? '';
  return (code ?? DEFAULT_LANGUAGE) as Language;
}

function resolveLanguage(): Language {
  const stored = useAppStore.getState()?.language;
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }

  // First launch — persist without calling i18n.changeLanguage (not initialized yet)
  const detected = detectDeviceLanguage();
  useAppStore.setState({ language: detected });
  return detected;
}

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const initDayjs = () => {
  const currentLanguage = useAppStore.getState()?.language ?? DEFAULT_LANGUAGE;
  dayjs.locale(currentLanguage);
};

const initI18n = async () => {
  const currentLanguage = resolveLanguage();

  await initI18nUse(initReactI18next).init({
    resources,
    lng: currentLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
    pluralSeparator: '_',
  });

  initDayjs();

  i18n.on('languageChanged', () => {
    translate.cache.clear?.();
  });
};

initI18n();

// Is it a RTL language?
export const isRTL: boolean = dir() === 'rtl';

I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

export default i18n;
