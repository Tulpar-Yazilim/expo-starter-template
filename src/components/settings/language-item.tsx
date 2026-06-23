import { useColorScheme } from 'nativewind';
import React, { useCallback, useMemo } from 'react';

import { Icon, Options, type OptionType, useModal } from '@/components/ui';
import colors from '@/components/ui/colors';
import { translate, useAppStore } from '@/lib';
import type { Language } from '@/lib/i18n/resources';

import { Item } from './item';

export const LanguageItem = () => {
  const { language, changeLanguage } = useAppStore();
  const modal = useModal();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? colors.neutral[400] : colors.neutral[500];

  const onSelect = useCallback(
    (option: OptionType) => {
      changeLanguage(option.value as Language);
      modal.dismiss();
    },
    [changeLanguage, modal],
  );

  const langs = useMemo(
    () => [{ label: translate('settings.english'), value: 'en' }],
    [],
  );

  const selectedLanguage = useMemo(
    () => langs.find((lang) => lang.value === language),
    [language, langs],
  );

  return (
    <>
      <Item
        text="settings.language"
        value={selectedLanguage?.label}
        onPress={modal.present}
        icon={<Icon type="feather" name="globe" size={16} color={iconColor} />}
      />
      <Options
        ref={modal.ref}
        options={langs}
        onSelect={onSelect}
        value={selectedLanguage?.value}
      />
    </>
  );
};
