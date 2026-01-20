import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../../src/translations/en.json';
import type { TxKeyPath } from '../../../src/lib/i18n/utils';
import { translate } from '../../../src/lib/i18n/utils';

jest.mock('../../../src/lib/storage', () => ({
  storage: {
    getString: jest.fn().mockReturnValue('en'),
  },
}));

// eslint-disable-next-line react-hooks/rules-of-hooks
use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  ns: ['translationsNS'],
  defaultNS: 'translationsNS',

  debug: true,

  interpolation: {
    escapeValue: false,
  },

  resources: { en: { translationsNS: en } },
});

describe('translate', () => {
  it('should return translated string', () => {
    const key: TxKeyPath = 'onboarding.title';
    const options = { lang: 'en' };
    const translatedString = translate(key, options);
    expect(translatedString).toBe('React Native Template');
  });
});
