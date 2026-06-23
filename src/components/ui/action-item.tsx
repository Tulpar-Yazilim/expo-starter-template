import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';

import { Icon, type IconLibrary, type IconNameForLibrary } from './icon';
import { Text } from './text';

interface ActionItemProps {
  icon: { type: IconLibrary; name: IconNameForLibrary<IconLibrary> };
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export const ActionItem = ({
  icon,
  label,
  onPress,
  variant = 'default',
  disabled = false,
}: ActionItemProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isDanger = variant === 'danger';
  const textColor = isDanger
    ? 'text-danger-600 dark:text-danger-500'
    : 'text-neutral-900 dark:text-white';
  let iconColor: string;
  if (isDanger) {
    iconColor = '#DC2626';
  } else {
    iconColor = isDark ? '#FFFFFF' : '#000000';
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-700 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Icon type={icon.type} name={icon.name} size={20} color={iconColor} />
      <Text className={`flex-1 font-medium ${textColor}`}>{label}</Text>
      <Icon type="feather" name="chevron-right" size={20} color={iconColor} />
    </Pressable>
  );
};
