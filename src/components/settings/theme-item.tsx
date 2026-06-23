import { useColorScheme } from 'nativewind';
import { useCallback, useMemo } from 'react';

import { Icon, Options, type OptionType, useModal } from '@/components/ui';
import colors from '@/components/ui/colors';
import { translate } from '@/lib';
import {
  type ColorSchemeType,
  useSelectedTheme,
} from '@/lib/hooks/use-selected-theme';

import { Item } from './item';

export const ThemeItem = () => {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();
  const modal = useModal();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? colors.neutral[400] : colors.neutral[500];

  const onSelect = useCallback(
    (option: OptionType) => {
      setSelectedTheme(option.value as ColorSchemeType);
      modal.dismiss();
    },
    [setSelectedTheme, modal],
  );

  const themes = useMemo(
    () => [
      { label: `${translate('settings.theme.dark')} 🌙`, value: 'dark' },
      { label: `${translate('settings.theme.light')} 🌞`, value: 'light' },
      { label: `${translate('settings.theme.system')} ⚙️`, value: 'system' },
    ],
    [],
  );

  const theme = useMemo(
    () => themes.find((t) => t.value === selectedTheme),
    [selectedTheme, themes],
  );

  return (
    <>
      <Item
        text="settings.theme.title"
        value={theme?.label}
        onPress={modal.present}
        icon={<Icon type="feather" name="moon" size={16} color={iconColor} />}
      />
      <Options
        ref={modal.ref}
        options={themes}
        onSelect={onSelect}
        value={theme?.value}
      />
    </>
  );
};
