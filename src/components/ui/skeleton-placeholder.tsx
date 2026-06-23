import { useColorScheme } from 'nativewind';
import React, { type FC, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import colors from './colors';

export type SkeletonPlaceholderProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  marginBottom?: number;
  variant?: 'text' | 'input' | 'card' | 'circle';
  animated?: boolean;
};

export const SkeletonPlaceholder: FC<SkeletonPlaceholderProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  marginBottom = 12,
  variant = 'text',
  animated = true,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const opacity = useSharedValue(0.6);

  useEffect(() => {
    if (animated) {
      opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }
  }, [animated, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getHeightByVariant = () => {
    switch (variant) {
      case 'input':
        return 48;
      case 'card':
        return 100;
      case 'circle':
        return typeof height === 'number' ? height : 16;
      default:
        return typeof height === 'number' ? height : 16;
    }
  };

  const getRadiusByVariant = () => {
    switch (variant) {
      case 'circle':
        return typeof height === 'number' ? height / 2 : 8;
      default:
        return borderRadius;
    }
  };

  const backgroundColor = isDark ? colors.charcoal[700] : colors.charcoal[200];

  const containerHeight = getHeightByVariant();

  return (
    <Animated.View
      style={[
        {
          width: width as never,
          height: containerHeight,
          backgroundColor,
          borderRadius: getRadiusByVariant(),
          marginBottom,
          overflow: 'hidden' as const,
        },
        animatedStyle,
      ]}
    />
  );
};

export const SkeletonInputGroup: FC<{
  count?: number;
  gap?: number;
}> = ({ count = 2, gap = 12 }) => (
  <View className="mb-4 flex-row gap-3">
    {Array.from({ length: count }).map((_, index) => (
      <View key={index} className="flex-1">
        <SkeletonPlaceholder variant="input" marginBottom={gap} />
      </View>
    ))}
  </View>
);

export const SkeletonTextBlock: FC<{
  lines?: number;
  gap?: number;
}> = ({ lines = 3, gap = 8 }) => (
  <View>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonPlaceholder
        key={index}
        height={16}
        marginBottom={index === lines - 1 ? 0 : gap}
        width={index === lines - 1 ? '80%' : '100%'}
      />
    ))}
  </View>
);

export const SkeletonCard: FC<{ gap?: number }> = ({ gap = 12 }) => (
  <View className="mb-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
    <SkeletonPlaceholder height={20} marginBottom={gap} width="40%" />
    <SkeletonTextBlock lines={2} gap={gap} />
    <SkeletonPlaceholder height={48} marginBottom={0} variant="input" />
  </View>
);
