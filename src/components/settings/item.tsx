import { useColorScheme } from 'nativewind';
import React, { forwardRef, type ReactNode } from 'react';

import { Icon, Pressable, Text, View } from '@/components/ui';
import colors from '@/components/ui/colors';
import type { TxKeyPath } from '@/lib';

type ItemProps = {
  text: TxKeyPath;
  value?: string;
  onPress?: () => void;
  icon?: ReactNode;
};

export const Item = forwardRef<View, ItemProps>(
  ({ text, value, icon, onPress }: ItemProps, ref) => {
    const isPressable = onPress !== undefined;
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        pointerEvents={isPressable ? 'auto' : 'none'}
        className="flex-row items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-700"
      >
        <View className="flex-row items-center gap-3">
          {icon && (
            <View className="size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-charcoal-700">
              {icon}
            </View>
          )}
          <Text className="font-medium dark:text-neutral-100" tx={text} />
        </View>
        <View className="flex-row items-center gap-1">
          {value && (
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              {value}
            </Text>
          )}
          {isPressable && (
            <Icon
              type="feather"
              name="chevron-right"
              size={16}
              color={isDark ? colors.charcoal['400'] : colors.neutral['400']}
            />
          )}
        </View>
      </Pressable>
    );
  },
);

Item.displayName = 'Item';
