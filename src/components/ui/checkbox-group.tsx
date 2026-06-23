import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useController,
} from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { Checkbox } from './checkbox';
import { Text } from './text';

interface CheckboxItem {
  key: string;
  label: string;
  checked?: boolean;
}

type TRule<T extends FieldValues> = Omit<
  RegisterOptions<T>,
  'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

export type CheckboxGroupControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule<T>;
};

interface CheckboxGroupProps {
  items: Array<CheckboxItem>;
  onChange: (key: string, value: boolean) => void;
  testID?: string;
  horizontal?: boolean;
}

type CheckboxGroupInnerProps<T extends FieldValues> = CheckboxGroupProps &
  Partial<CheckboxGroupControllerType<T>>;

function CheckboxGroupInner<T extends FieldValues>({
  items,
  onChange: externalOnChange,
  testID,
  horizontal = false,
  ...controllerProps
}: CheckboxGroupInnerProps<T>) {
  const { name, control, rules } =
    controllerProps as CheckboxGroupControllerType<T>;

  const controller =
    name && control
      ? // eslint-disable-next-line react-compiler/react-compiler,react-hooks/rules-of-hooks
        useController({ name, control, rules })
      : null;

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialChecked = items.reduce(
      (acc, item) => {
        acc[item.key] = item.checked ?? false;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setChecked(initialChecked);
  }, [items]);

  const handleChange = useCallback(
    (key: string, value: boolean) => {
      setChecked((prev) => ({ ...prev, [key]: value }));
      if (controller) {
        // If controlled by form, use field.onChange
        const newChecked = { ...checked, [key]: value };
        controller.field.onChange(newChecked);
      } else {
        // Otherwise use external onChange
        externalOnChange(key, value);
      }
    },
    [checked, controller, externalOnChange],
  );

  const errorMessage = controller?.fieldState.error?.message;

  const checkboxItems = items.map((item) => (
    <Checkbox
      key={item.key}
      label={item.label}
      accessibilityLabel={item.label}
      checked={checked[item.key] || false}
      onChange={(value) => handleChange(item.key, value)}
      testID={`${testID}-${item.key}`}
    />
  ));

  const containerClass = horizontal
    ? 'border-b border-neutral-200 pb-4 dark:border-neutral-700'
    : 'gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700';

  return (
    <View>
      <View className={containerClass}>
        {horizontal ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4 pr-4">{checkboxItems}</View>
          </ScrollView>
        ) : (
          <View className="gap-3">{checkboxItems}</View>
        )}
      </View>
      {errorMessage && (
        <Text className="mt-1 text-sm text-danger-400 dark:text-danger-600">
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

export const CheckboxGroup = memo(
  CheckboxGroupInner,
) as typeof CheckboxGroupInner;
