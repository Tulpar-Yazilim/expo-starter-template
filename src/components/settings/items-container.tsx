import React, { type ReactNode } from 'react';

import { Text, View } from '@/components/ui';
import type { TxKeyPath } from '@/lib';

type Props = {
  children: ReactNode;
  title?: TxKeyPath;
};

export const ItemsContainer = ({ children, title }: Props) => (
  <View className="gap-1">
    {title && (
      <Text
        className="px-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
        tx={title}
      />
    )}
    <View className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-charcoal-800">
      {children}
    </View>
  </View>
);
