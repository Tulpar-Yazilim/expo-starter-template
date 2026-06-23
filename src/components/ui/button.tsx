import { useColorScheme } from 'nativewind';
import { forwardRef, useMemo } from 'react';
import type { PressableProps, View } from 'react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import colors from '@/components/ui/colors';

import { translate, type TxKeyPath } from '../../lib/i18n';
import { Icon, type IconLibrary } from './icon';

const TEXT_WHITE = 'text-white';
const button = tv({
  slots: {
    container: 'my-2 flex flex-row items-center justify-center rounded-md px-4',
    label: 'font-inter text-base font-semibold',
    indicator: 'h-6 text-white',
    icon: 'mr-2',
    rightIcon: 'ml-2',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-cyan-600 dark:bg-white',
        label: 'text-white dark:text-black',
        indicator: 'text-white dark:text-black',
        icon: 'text-white dark:text-black',
        rightIcon: 'text-white dark:text-black',
      },
      secondary: {
        container: 'bg-primary-600',
        label: 'text-secondary-600',
        indicator: TEXT_WHITE,
        icon: 'text-secondary-600',
        rightIcon: 'text-secondary-600',
      },
      outline: {
        container: 'border border-neutral-400',
        label: 'text-black dark:text-neutral-100',
        indicator: 'text-black dark:text-neutral-100',
        icon: 'text-black dark:text-neutral-100',
        rightIcon: 'text-black dark:text-neutral-100',
      },
      'outline-primary': {
        container: 'border-2 border-cyan-600 dark:border-white',
        label: 'text-cyan-600 dark:text-white',
        indicator: 'text-cyan-600 dark:text-white',
        icon: 'text-cyan-600 dark:text-white',
        rightIcon: 'text-cyan-600 dark:text-white',
      },
      'outline-danger': {
        container: 'border-2 border-red-600',
        label: 'text-red-600',
        indicator: 'text-red-600',
        icon: 'text-red-600',
        rightIcon: 'text-red-600',
      },
      'outline-success': {
        container: 'border-2 border-green-600',
        label: 'text-green-600',
        indicator: 'text-green-600',
        icon: 'text-green-600',
        rightIcon: 'text-green-600',
      },
      destructive: {
        container: 'bg-red-600',
        label: TEXT_WHITE,
        indicator: TEXT_WHITE,
        icon: TEXT_WHITE,
        rightIcon: TEXT_WHITE,
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-black underline dark:text-white',
        indicator: 'text-black dark:text-white',
        icon: 'text-black dark:text-white',
        rightIcon: 'text-black dark:text-white',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-black',
        indicator: 'text-black',
        icon: 'text-black',
        rightIcon: 'text-black',
      },
    },
    size: {
      default: {
        container: 'h-10 px-4',
        label: 'text-base',
        icon: 'text-xl',
        rightIcon: 'text-xl',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
        icon: 'text-2xl',
        rightIcon: 'text-2xl',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-2',
        icon: 'text-lg',
        rightIcon: 'text-lg',
      },
      icon: { container: 'size-9' },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300 dark:bg-neutral-300',
        label: 'text-neutral-600 dark:text-neutral-600',
        indicator: 'text-neutral-400 dark:text-neutral-400',
        icon: 'text-neutral-600 dark:text-neutral-600',
        rightIcon: 'text-neutral-600 dark:text-neutral-600',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;

interface IconProps {
  type: IconLibrary;
  name: string;
  size?: number;
}

interface Props extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: TxKeyPath;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
}

export const Button = forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      textClassName = '',
      leftIcon,
      rightIcon: rightIconProp,
      ...props
    },
    ref,
  ) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const styles = useMemo(
      () => button({ variant, disabled, size }),
      [variant, disabled, size],
    );

    const getIconSize = () => {
      switch (size) {
        case 'lg':
          return 24;
        case 'sm':
          return 16;
        case 'icon':
          return 20;
        default:
          return 20;
      }
    };

    const getIconColor = () => {
      if (disabled) {
        return isDark ? colors.neutral[600] : colors.neutral[600];
      }

      switch (variant) {
        case 'default':
          return isDark ? colors.black : colors.white;
        case 'secondary':
          return colors.primary[600];
        case 'outline':
          return isDark ? colors.neutral[100] : colors.black;
        case 'outline-primary':
          return isDark ? colors.white : colors.primary[600];
        case 'outline-danger':
          return colors.danger[600];
        case 'outline-success':
          return colors.success[600];
        case 'destructive':
          return colors.white;
        case 'ghost':
          return isDark ? colors.white : colors.black;
        case 'link':
          return colors.black;
        default:
          return isDark ? colors.white : colors.black;
      }
    };

    const iconSize = getIconSize();
    const iconColor = getIconColor();

    const renderContent = () => {
      if (props?.children) {
        return props.children;
      }

      if (loading) {
        return (
          <ActivityIndicator
            size="small"
            className={styles.indicator()}
            testID={testID ? `${testID}-activity-indicator` : undefined}
          />
        );
      }

      return (
        <>
          {leftIcon && (
            <Icon
              type={leftIcon.type}
              name={leftIcon.name}
              size={leftIcon.size ?? iconSize}
              color={iconColor}
              style={{ marginRight: 4 }}
            />
          )}
          {text && (
            <Text
              testID={testID ? `${testID}-label` : undefined}
              className={styles.label({ className: textClassName })}
            >
              {translate(text as TxKeyPath)}
            </Text>
          )}
          {rightIconProp && (
            <Icon
              type={rightIconProp.type}
              name={rightIconProp.name}
              size={rightIconProp.size ?? iconSize}
              color={iconColor}
              style={{ marginLeft: 4 }}
            />
          )}
        </>
      );
    };

    return (
      <Pressable
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
      >
        {renderContent()}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
