import React from 'react';
import { View } from 'react-native';

import { Text } from './text';

export interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => (
  <View className="items-center justify-center py-8">
    <Text className="text-sm text-neutral-400 dark:text-neutral-500">
      {message}
    </Text>
  </View>
);

EmptyState.displayName = 'EmptyState';
