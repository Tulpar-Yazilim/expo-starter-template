import React, { memo } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useController,
} from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { Radio } from './checkbox';
import { Text } from './text';

type TRule<T extends FieldValues> = Omit<
  RegisterOptions<T>,
  'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

export type RadioGroupControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule<T>;
};

interface RadioGroupProps {
  label?: string;
  testID?: string;
  horizontal?: boolean;
  containerClassName?: string;
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

function RadioGroupInner<T extends FieldValues>({
  label,
  options,
  testID,
  containerClassName,
  horizontal = false,
  value: externalValue,
  onChange: externalOnChange,
  ...controllerProps
}: RadioGroupProps & Partial<RadioGroupControllerType<T>>) {
  const { name, control, rules } =
    controllerProps as RadioGroupControllerType<T>;

  const controller =
    name && control
      ? // eslint-disable-next-line react-compiler/react-compiler,react-hooks/rules-of-hooks
        useController({ name, control, rules })
      : null;

  const value = controller ? controller.field.value : externalValue;
  const onChange = controller ? controller.field.onChange : externalOnChange;
  const errorMessage = controller?.fieldState.error?.message;

  const radioOptions = options.map((option) => (
    <Radio
      key={option.value}
      label={option.label}
      checked={value === option.value}
      onChange={() => onChange?.(option.value)}
      accessibilityLabel={option.label}
      testID={`${testID}-${option.value}`}
    />
  ));

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="mb-3 font-medium dark:text-white">{label}</Text>
      )}
      {horizontal ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4 pr-4">{radioOptions}</View>
          </ScrollView>
          {errorMessage && (
            <Text className="mt-1 text-sm text-danger-400 dark:text-danger-600">
              {errorMessage}
            </Text>
          )}
        </View>
      ) : (
        <View className="gap-3">
          {radioOptions}
          {errorMessage && (
            <Text className="mt-1 text-sm text-danger-400 dark:text-danger-600">
              {errorMessage}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

export const RadioGroup = memo(RadioGroupInner) as typeof RadioGroupInner;
