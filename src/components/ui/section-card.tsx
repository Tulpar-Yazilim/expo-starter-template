import React from 'react';
import { View } from 'react-native';

import { Text } from './text';

export interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const SectionCard = ({
  title,
  children,
  headerRight,
}: SectionCardProps) => (
  <View className="mb-4 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-charcoal-800">
    <View className="flex-row items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-charcoal-700">
      <Text className="text-base font-bold dark:text-white">{title}</Text>
      {headerRight}
    </View>
    {children}
  </View>
);

SectionCard.displayName = 'SectionCard';
