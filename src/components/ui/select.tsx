import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import {
  Pressable,
  type PressableProps,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { tv } from 'tailwind-variants';

import colors from '@/components/ui/colors';

import { translate, type TxKeyPath } from '../../lib/i18n';
import { Button } from './button';
import { Icon } from './icon';
import { Input } from './input';
import { Modal, useModal } from './modal';
import { Text } from './text';

/* -------------------------------------------------------
 * Types
 * -------------------------------------------------------*/

export type OptionType = {
  label: string;
  value: string | number;
};

export type SelectValue = string | number | Array<string | number> | undefined;

type TSelectRule<T extends FieldValues> = Omit<
  RegisterOptions<T>,
  'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

export type SelectControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TSelectRule<T>;
};

/* -------------------------------------------------------
 * Styles
 * -------------------------------------------------------*/

const selectTv = tv({
  slots: {
    container: 'mb-4',
    label: 'text-md text-grey-100 mb-1 dark:text-neutral-100',
    input:
      'flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800/50',
    inputValue: 'dark:text-neutral-100',
  },
  variants: {
    error: {
      true: {
        input: 'border-danger-600',
        label: 'text-danger-600',
        inputValue: 'text-danger-600',
      },
    },
    disabled: {
      true: {
        input: 'bg-neutral-200',
      },
    },
  },
});

/* -------------------------------------------------------
 * Helpers
 * -------------------------------------------------------*/

function isSelected(value: SelectValue, optionValue: string | number) {
  if (Array.isArray(value)) {
    return value.includes(optionValue);
  }
  return value === optionValue;
}

/* -------------------------------------------------------
 * Options Modal
 * -------------------------------------------------------*/

type OptionsProps = {
  title?: TxKeyPath;
  options: Array<OptionType>;
  value?: SelectValue;
  searchable?: boolean;
  multiple?: boolean;
  onSelect: (option: OptionType) => void;
  onDone?: () => void;
  onClear?: () => void;
  onSelectAll?: () => void;
  testID?: string;
};

export const Options = forwardRef<BottomSheetModal, OptionsProps>(
  (
    {
      title,
      options,
      value,
      searchable,
      multiple,
      onSelect,
      onDone,
      onClear,
      onSelectAll,
      testID,
    },
    ref,
  ) => {
    const OPTION_HEIGHT = 56;
    const SEARCH_HEIGHT = searchable ? 56 : 0;
    const FOOTER_HEIGHT = multiple ? 96 : 0;
    const HEIGHT_MARGIN = 120;

    const [query, setQuery] = useState('');

    const selectedCount = Array.isArray(value) ? value.length : 0;

    const { height: screenHeight } = useWindowDimensions();

    const internalRef = useRef<BottomSheetModal>(null);

    const filteredOptions = useMemo(() => {
      if (!query.trim()) {
        return options;
      }
      return options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      );
    }, [options, query]);

    const contentHeight =
      filteredOptions.length * OPTION_HEIGHT +
      SEARCH_HEIGHT +
      FOOTER_HEIGHT +
      HEIGHT_MARGIN;

    const isFullHeight = contentHeight >= screenHeight * 0.85;

    const height = isFullHeight ? screenHeight * 0.95 : contentHeight;

    const snapPoints = useMemo(() => [height], [height]);

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <Modal
        ref={ref ?? internalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: isDark ? colors.neutral[800] : colors.white,
        }}
      >
        {title && (
          <View className="flex-row items-center justify-center border-b border-gray-200 px-4 pb-2">
            <Text className="text-lg font-semibold" tx={title} />
          </View>
        )}

        {/* 🔍 SEARCH */}
        {searchable && (
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="common.search"
            placeholderTextColor={
              isDark ? colors.neutral[400] : colors.neutral[500]
            }
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            clearable
            leftIcon={{
              type: 'feather',
              name: 'search',
              size: 20,
              color: colors.neutral[400],
            }}
            className="font-medium text-gray-700 dark:text-gray-300"
          />
        )}

        {/* 📜 LIST */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          contentContainerStyle={{
            paddingBottom: multiple ? 12 : 0,
          }}
          testID={testID ? `${testID}-modal` : undefined}
        >
          {filteredOptions.map((item) => (
            <Option
              key={`select-item-${item.value}`}
              label={item.label}
              selected={isSelected(value, item.value)}
              onPress={() => onSelect(item)}
              testID={testID ? `${testID}-item-${item.value}` : undefined}
            />
          ))}
        </ScrollView>

        {/* ✅ FOOTER */}
        {multiple && (
          <View className="border-t border-neutral-300 p-4 dark:border-neutral-700">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                {translate('common.selected')}: {selectedCount}
              </Text>

              <View className="flex-row items-center gap-4">
                <Pressable
                  onPress={onSelectAll}
                  disabled={options?.length === selectedCount}
                  testID={testID ? `${testID}-select-all` : undefined}
                >
                  <Text
                    className={`text-sm ${
                      options?.length !== selectedCount
                        ? 'text-blue-600'
                        : 'text-neutral-400'
                    }`}
                    tx="common.selectAll"
                  />
                </Pressable>

                <Pressable
                  onPress={onClear}
                  disabled={!selectedCount}
                  testID={testID ? `${testID}-clear` : undefined}
                >
                  <Text
                    className={`text-sm ${
                      selectedCount ? 'text-danger-600' : 'text-neutral-400'
                    }`}
                    tx="common.clearAll"
                  />
                </Pressable>
              </View>
            </View>

            <Button
              label={`${translate('common.confirm')}${selectedCount ? ` (${selectedCount})` : ''}`}
              onPress={onDone}
              testID={testID ? `${testID}-done` : undefined}
            />
          </View>
        )}
      </Modal>
    );
  },
);

Options.displayName = 'Options';

/* -------------------------------------------------------
 * Option Row
 * -------------------------------------------------------*/

const Option = memo(
  ({
    label,
    selected,
    ...props
  }: PressableProps & { label: string; selected?: boolean }) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <Pressable
        className="flex-row items-center border-b border-neutral-300 p-3 dark:border-neutral-700 dark:bg-neutral-800"
        {...props}
      >
        <Text className="flex-1 dark:text-neutral-100">{label}</Text>
        {selected && (
          <Icon
            type="feather"
            name="check"
            color={isDark ? colors.neutral['400'] : colors.neutral['500']}
          />
        )}
      </Pressable>
    );
  },
);

Option.displayName = 'Option';

/* -------------------------------------------------------
 * Select Component
 * -------------------------------------------------------*/

export interface SelectProps {
  label?: string;
  value?: SelectValue;
  options?: Array<OptionType>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  multiple?: boolean;
  searchable?: boolean;
  onSelect?: (value: SelectValue) => void;
  testID?: string;
  className?: string;
  containerClassName?: string;
}

export const Select = ({
  label,
  value,
  options = [],
  placeholder,
  disabled = false,
  error,
  multiple = false,
  searchable = false,
  onSelect,
  testID,
  className,
  containerClassName,
}: SelectProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const modal = useModal();

  const styles = useMemo(
    () =>
      selectTv({
        error: Boolean(error),
        disabled,
      }),
    [error, disabled],
  );

  const textValue = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      if (!value.length) {
        return placeholder ?? label;
      }
      return options
        .filter((o) => value.includes(o.value))
        .map((o) => o.label)
        .join(', ');
    }

    if (!multiple && value !== undefined) {
      return (
        options.find((o) => o.value === value)?.label ?? placeholder ?? label
      );
    }

    return placeholder ?? label;
  }, [value, options, placeholder, multiple]);

  const onSelectOption = useCallback(
    (option: OptionType) => {
      if (!multiple) {
        onSelect?.(option.value);
        modal.dismiss();
        return;
      }

      const current = Array.isArray(value) ? value : [];
      const exists = current.includes(option.value);

      const next = exists
        ? current.filter((v) => v !== option.value)
        : [...current, option.value];

      onSelect?.(next);
    },
    [multiple, value, onSelect, modal],
  );

  const onDone = useCallback(() => {
    modal.dismiss();
  }, [modal]);

  const onClear = useCallback(() => {
    onSelect?.([]);
  }, [onSelect]);

  const onSelectAll = useCallback(() => {
    onSelect?.(options?.map((o) => o.value));
  }, [onSelect, options]);

  return (
    <>
      <View className={`${styles.container()} ${containerClassName}`}>
        {label && (
          <Text className={styles.label()} testID={`${testID}-label`}>
            {label}
          </Text>
        )}

        <Pressable
          className={`${styles.input()} ${className}`}
          disabled={disabled}
          onPress={() => modal.present()}
          testID={`${testID}-trigger`}
        >
          <View className="flex-1">
            <Text className={styles.inputValue()} numberOfLines={1}>
              {textValue}
            </Text>
          </View>
          <Icon
            type="feather"
            name="chevron-down"
            color={isDark ? colors.neutral[400] : colors.neutral[500]}
          />
        </Pressable>

        {error && (
          <Text
            className="mt-1 text-sm text-danger-400 dark:text-danger-600"
            testID={`${testID}-error`}
          >
            {error}
          </Text>
        )}
      </View>

      <Options
        ref={modal.ref}
        title={label}
        options={options}
        value={value}
        searchable={searchable}
        multiple={multiple}
        onSelect={onSelectOption}
        onDone={onDone}
        onClear={onClear}
        onSelectAll={onSelectAll}
        testID={testID}
      />
    </>
  );
};

Select.displayName = 'Select';

/* -------------------------------------------------------
 * Controlled Select (react-hook-form)
 * -------------------------------------------------------*/

interface ControlledSelectProps<T extends FieldValues>
  extends Omit<SelectProps, 'value' | 'onSelect'>, SelectControllerType<T> {}

export function ControlledSelect<T extends FieldValues>({
  name,
  control,
  rules,
  ...props
}: ControlledSelectProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules: rules as RegisterOptions<T>,
  });

  const onSelect = useCallback(
    (value: SelectValue) => {
      field.onChange(value);
    },
    [field],
  );

  return (
    <Select
      {...props}
      value={field.value}
      onSelect={onSelect}
      error={fieldState.error?.message}
    />
  );
}
