import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import {
  type BlurEvent,
  FlatList,
  type FocusEvent,
  Pressable,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import {
  I18nManager,
  Platform,
  StyleSheet,
  TextInput as NTextInput,
  View,
} from 'react-native';
import { tv } from 'tailwind-variants';

import { translate, type TxKeyPath } from '../../lib/i18n';
import colors from './colors';
import { Icon, type IconLibrary, type IconNameForLibrary } from './icon';
import { Text } from './text';
import {
  applyInternationalPhoneMask,
  applyMaskPattern,
  getUnmaskedValue,
  MASKS,
  type MaskType,
} from './utils';

const inputTv = tv({
  slots: {
    container: '',
    label: 'text-grey-100 text-md mb-1 dark:text-neutral-100',
    input:
      'flex-1 rounded-md font-inter text-base font-medium leading-5 dark:text-white',
    inputWrapper:
      'flex-row items-center rounded-md border-[0.5px] border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800',
  },

  variants: {
    focused: {
      true: {
        inputWrapper: 'border-neutral-400 dark:border-neutral-300',
      },
    },
    error: {
      true: {
        inputWrapper: 'border-danger-600',
        label: 'text-danger-600 dark:text-danger-600',
      },
    },
    disabled: {
      true: {
        inputWrapper: 'bg-neutral-200',
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface AutocompleteOption {
  label: string;
  value: string;
}

export interface NInputProps extends TextInputProps {
  label?: TxKeyPath;
  placeholder?: TxKeyPath;
  disabled?: boolean;
  error?: string;
  clearable?: boolean;
  containerClassName?: string;
  /**
   * Mask type:
   * - 'phone': (XXX) XXX-XXXX format
   * - 'phoneInternational': +X (XXX) XXX-XXXX format (fixed)
   * - 'phoneInternationalDynamic': Dynamic country code (+90, +1, +44 etc.)
   * - 'creditCard': XXXX XXXX XXXX XXXX format
   * - 'cpf': XXX.XXX.XXX-XX format (Brazil)
   * - 'cnpj': XX.XXX.XXX/XXXX-XX format (Brazil)
   * - 'zipCode': XXXXX-XXX format
   * - 'email': Email format (no masking)
   */
  mask?: MaskType;
  onMaskedValueChange?: (maskedValue: string, unmaskedValue: string) => void;
  leftIcon?: {
    type: IconLibrary;
    name: IconNameForLibrary<IconLibrary>;
    size?: number;
    color?: string;
  };
  rightIcon?: {
    type: IconLibrary;
    name: IconNameForLibrary<IconLibrary>;
    size?: number;
    color?: string;
    onPress?: () => void;
  };
  // Autocomplete
  autocompleteOptions?: Array<AutocompleteOption>;
  onAutocompleteSelect?: (option: AutocompleteOption) => void;
  filterAutocompleteOptions?: (
    text: string,
    options: Array<AutocompleteOption>,
  ) => Array<AutocompleteOption>;
  showAutocompleteOnFocus?: boolean;
  maxAutocompleteResults?: number;
}

type TRule<T extends FieldValues> = Omit<
  RegisterOptions<T>,
  'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule<T>;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps, InputControllerType<T> {}

export const Input = forwardRef<NTextInput, NInputProps>((props, ref) => {
  const {
    containerClassName,
    label,
    error,
    testID,
    onBlur: propsOnBlur,
    onFocus: propsOnFocus,
    leftIcon,
    rightIcon,
    clearable = false,
    value,
    mask,
    onChangeText: propsOnChangeText,
    onMaskedValueChange,
    autocompleteOptions = [],
    onAutocompleteSelect,
    filterAutocompleteOptions,
    showAutocompleteOnFocus = false,
    maxAutocompleteResults = 5,
    ...inputProps
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const handleBlur = useCallback(
    (ev: BlurEvent) => {
      setIsFocused(false);
      // Autocomplete listesini kapat
      setTimeout(() => {
        setShowAutocomplete(false);
      }, 200);
      propsOnBlur?.(ev);
    },
    [propsOnBlur],
  );

  const handleFocus = useCallback(
    (ev: FocusEvent) => {
      setIsFocused(true);
      if (showAutocompleteOnFocus) {
        setShowAutocomplete(true);
      }
      propsOnFocus?.(ev);
    },
    [propsOnFocus, showAutocompleteOnFocus],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      let finalValue = text;

      if (mask) {
        if (mask === 'phoneInternationalDynamic') {
          // Dynamic international phone masking with auto-detection
          finalValue = applyInternationalPhoneMask(text);
        } else {
          // Get the actual mask pattern from MASKS
          const maskPattern = MASKS[mask] as string;

          // Only apply masking if pattern is not empty and not 'dynamic'
          if (maskPattern && maskPattern !== 'dynamic' && maskPattern !== '') {
            finalValue = applyMaskPattern(text, maskPattern);
          }
        }

        // Always notify of masked/unmasked values
        const unmaskedValue = getUnmaskedValue(finalValue);
        onMaskedValueChange?.(finalValue, unmaskedValue);
      }

      propsOnChangeText?.(finalValue);

      // Autocomplete'i aç (text varsa)
      if (autocompleteOptions.length > 0 && finalValue.length > 0) {
        setShowAutocomplete(true);
      }
    },
    [propsOnChangeText, mask, onMaskedValueChange, autocompleteOptions.length],
  );

  const handleClear = useCallback(() => {
    propsOnChangeText?.('');
    setShowAutocomplete(false);
  }, [propsOnChangeText]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Filtrelenmiş autocomplete options
  const filteredOptions = useMemo(() => {
    if (!showAutocomplete || !value || typeof value !== 'string') {
      return [];
    }

    let filtered = autocompleteOptions;

    // Özel filter fonksiyonu varsa kullan
    if (filterAutocompleteOptions) {
      filtered = filterAutocompleteOptions(value, autocompleteOptions);
    } else {
      // Varsayılan filter: büyük/küçük harfe duyarsız kısmi eşleşme
      const lowerValue = value.toLowerCase();
      filtered = autocompleteOptions.filter((option) =>
        option.label.toLowerCase().includes(lowerValue),
      );
    }

    return filtered.slice(0, maxAutocompleteResults);
  }, [
    showAutocomplete,
    value,
    autocompleteOptions,
    filterAutocompleteOptions,
    maxAutocompleteResults,
  ]);

  const handleSelectOption = useCallback(
    (option: AutocompleteOption) => {
      propsOnChangeText?.(option.label);
      onAutocompleteSelect?.(option);
      setShowAutocomplete(false);
    },
    [propsOnChangeText, onAutocompleteSelect],
  );

  const styles = useMemo(
    () =>
      inputTv({
        error: Boolean(error),
        focused: isFocused,
        disabled: Boolean(props.disabled),
      }),
    [error, isFocused, props.disabled],
  );

  const translatedPlaceholder = useMemo(
    () => translate(props.placeholder as TxKeyPath),
    [props.placeholder],
  );

  const isPasswordField =
    props.secureTextEntry ?? props.textContentType === 'password';
  const secureTextEntry = isPasswordField && !showPassword;

  const inputStyle = useMemo(
    () =>
      StyleSheet.flatten([
        { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
        { textAlign: I18nManager.isRTL ? 'right' : 'left' },
        { minHeight: 20, flex: 1 },
        Platform.OS === 'android' && {
          padding: 0,
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        inputProps.style,
      ]),
    [inputProps.style],
  ) as StyleProp<TextStyle>;

  const showClearButton = clearable && value && value?.length > 0;
  const showCustomRightIcon = !isPasswordField && rightIcon && !showClearButton;

  return (
    <View className={`${styles.container()} ${containerClassName}`}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label()}
        >
          {translate(label as TxKeyPath)}
        </Text>
      )}
      <View className={styles.inputWrapper()}>
        {/* LEFT ICON */}
        {leftIcon && (
          <View className="mr-2">
            <Icon
              type={leftIcon.type}
              name={leftIcon.name}
              size={leftIcon.size ?? 20}
              color={leftIcon.color ?? colors.neutral[400]}
            />
          </View>
        )}

        {/* TEXT INPUT */}
        <NTextInput
          testID={testID}
          ref={ref}
          placeholderTextColor={colors.neutral[400]}
          className={styles.input()}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...inputProps}
          value={value}
          onChangeText={handleChangeText}
          placeholder={translatedPlaceholder}
          secureTextEntry={secureTextEntry}
          style={inputStyle}
          maxFontSizeMultiplier={1}
          numberOfLines={inputProps.numberOfLines ?? 1}
          keyboardType={
            !!mask && mask !== 'email' ? 'numeric' : inputProps.keyboardType
          }
        />

        {/* RIGHT ICONS CONTAINER */}
        <View className="flex-row gap-2">
          {/* CLEAR BUTTON */}
          {showClearButton && (
            <Pressable
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                type="feather"
                name="x"
                size={20}
                color={colors.neutral[400]}
              />
            </Pressable>
          )}

          {/* CUSTOM RIGHT ICON */}
          {showCustomRightIcon && (
            <Pressable
              onPress={rightIcon.onPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                type={rightIcon.type}
                name={rightIcon.name}
                size={rightIcon.size ?? 20}
                color={rightIcon.color ?? colors.neutral[400]}
              />
            </Pressable>
          )}

          {/* PASSWORD VISIBILITY TOGGLE */}
          {isPasswordField && (
            <Pressable
              onPress={togglePasswordVisibility}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                type="feather"
                color={colors.neutral[400]}
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* AUTOCOMPLETE OPTIONS LIST */}
      {filteredOptions.length > 0 && (
        <View
          className="absolute inset-x-0 top-full z-50 mt-1 rounded-md border-[0.5px] border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
          style={{ maxHeight: 200 }}
        >
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            scrollEnabled={filteredOptions.length > 3}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectOption(item)}
                className="border-b-[0.5px] border-neutral-200 px-3 py-2.5 dark:border-neutral-700"
              >
                <Text className="text-base font-medium text-neutral-900 dark:text-white">
                  {translate(item.label)}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="text-sm text-danger-400 dark:text-danger-600"
        >
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>,
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({
    control,
    name,
    rules: rules as RegisterOptions<T>,
  });

  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={field.value?.toString() ?? ''}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
