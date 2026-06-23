import React from 'react';
import { Linking, Pressable, View } from 'react-native';

import { Text } from './text';

// ─── Types ───────────────────────────────────────────────────────────────────

export type InfoRowAction = 'phone' | 'email';

export interface InfoRowProps {
  label: string;
  value?: string | number | null;
  /** Provide a shorthand action or a custom handler. */
  action?: InfoRowAction;
  onPress?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveHandler(
  value: string | number | null | undefined,
  action?: InfoRowAction,
  onPress?: () => void,
): (() => void) | undefined {
  if (!value && value !== 0) {
    return undefined;
  }

  if (onPress) {
    return onPress;
  }

  if (action === 'phone') {
    return () => Linking.openURL(`tel:${value}`);
  }
  if (action === 'email') {
    return () => Linking.openURL(`mailto:${value}`);
  }

  return undefined;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const InfoRow = ({ label, value, action, onPress }: InfoRowProps) => {
  const isEmpty = value == null || value === '';
  const handler = isEmpty ? undefined : resolveHandler(value, action, onPress);
  const isInteractive = !!handler;

  const content = (
    <View className="flex-row border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
      <Text className="w-2/5 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
        {label}
      </Text>
      <Text
        className={`w-3/5 text-sm ${isInteractive ? 'text-primary-500 underline' : 'dark:text-white'}`}
      >
        {!isEmpty ? String(value) : '-'}
      </Text>
    </View>
  );

  if (isInteractive) {
    return (
      <Pressable
        onPress={handler}
        android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

InfoRow.displayName = 'InfoRow';
