import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

export * from './action-item';
export * from './button';
export * from './checkbox';
export * from './checkbox-group';
export { default as colors } from './colors';
export * from './date-time-picker';
export * from './empty-state';
export * from './focus-aware-status-bar';
export * from './icon';
export * from './image';
export * from './info-row';
export * from './input';
export * from './list';
export * from './modal';
export * from './progress-bar';
export * from './radio-group';
export * from './section-card';
export * from './select';
export * from './skeleton-placeholder';
export * from './text';
export * from './utils';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
export * from 'react-native-reanimated';
export { SafeAreaView } from 'react-native-safe-area-context';

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});
