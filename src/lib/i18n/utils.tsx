import type TranslateOptions from 'i18next';
import { t } from 'i18next';
import memoize from 'lodash.memoize';

import type { resources } from './resources';
import type { RecursiveKeyOf } from './types';

type DefaultLocale = typeof resources.en.translation;
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

export const translate = memoize(
  (key: TxKeyPath, options = undefined) => t(key, options) as unknown as string,
  (key: TxKeyPath, options: typeof TranslateOptions) =>
    options ? key + JSON.stringify(options) : key,
);
