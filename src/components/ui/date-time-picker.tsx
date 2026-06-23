import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'nativewind';
import { useMemo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { tv } from 'tailwind-variants';

import colors from '@/components/ui/colors';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { translate, useAppStore } from '@/lib';

import { type TxKeyPath } from '../../lib/i18n';
import { Button } from './button';
import { Modal, useModal } from './modal';
import { IS_ANDROID, IS_IOS } from './utils';

/* -------------------------------------------------- */
/* Styles */
/* -------------------------------------------------- */

const datepickerTv = tv({
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

/* -------------------------------------------------- */
/* Types */
/* -------------------------------------------------- */

type Props = {
  label?: TxKeyPath;
  mode?: 'date' | 'time' | 'datetime';
  dateFormat?: string;
  value?: Date;
  disabled?: boolean;
  error?: string;

  minDate?: Date;
  maxDate?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;

  haptic?: boolean;
  onConfirm: (date: Date) => void;
};

/* -------------------------------------------------- */
/* Component */
/* -------------------------------------------------- */

export function DatePicker({
  label,
  mode = 'date',
  dateFormat,
  value,
  disabled,
  error,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
  haptic = true,
  onConfirm,
}: Props) {
  const language = useAppStore((s) => s.language);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  let formattedDate: string;
  if (mode === 'datetime') {
    formattedDate = dateFormat ?? 'DD.MM.YYYY HH:mm';
  } else {
    formattedDate = (dateFormat ?? mode === 'date') ? 'DD.MM.YYYY' : 'HH:mm';
  }

  const modal = useModal();
  const [tempDate, setTempDate] = useState<Date | undefined>(value);

  /* Android state */
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const [androidMode, setAndroidMode] = useState<'date' | 'time'>('date');

  /* -------------------------------------------------- */
  /* Helpers */
  /* -------------------------------------------------- */

  const today = new Date();
  const resolvedMinDate = minDate ?? (disablePast ? today : undefined);
  const resolvedMaxDate = maxDate ?? (disableFuture ? today : undefined);

  const triggerHaptic = async () => {
    if (!haptic) {
      return;
    }
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const styles = useMemo(
    () => datepickerTv({ error: Boolean(error), disabled }),
    [error, disabled],
  );

  /* -------------------------------------------------- */
  /* Handlers */
  /* -------------------------------------------------- */

  const openPicker = async () => {
    if (disabled) {
      return;
    }
    await triggerHaptic();
    setTempDate(value);

    if (Platform.OS === 'android') {
      setAndroidMode('date');
      setShowAndroidPicker(true);
    } else {
      modal.present();
    }
  };

  const confirmIOSPicker = async () => {
    await triggerHaptic();
    onConfirm(tempDate!);
    modal.dismiss();
  };

  const onIOSChange = (_: DateTimePickerChangeEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const onAndroidChange = (
    _: DateTimePickerChangeEvent,
    selectedDate?: Date,
  ) => {
    if (!selectedDate) {
      return;
    }

    if (mode === 'date' || mode === 'time') {
      triggerHaptic();
      setTempDate(selectedDate);
      onConfirm(selectedDate);
      setShowAndroidPicker(false);
      return;
    }

    // datetime → date step → time step
    if (androidMode === 'date') {
      setTempDate(selectedDate);
      setAndroidMode('time');
    } else {
      const finalDate = dayjs(tempDate)
        .hour(dayjs(selectedDate).hour())
        .minute(dayjs(selectedDate).minute())
        .toDate();

      triggerHaptic();
      onConfirm(finalDate);
      setAndroidMode('date');
      setShowAndroidPicker(false);
    }
  };

  /* -------------------------------------------------- */
  /* Render */
  /* -------------------------------------------------- */

  return (
    <>
      {/* Input trigger */}
      <View className={styles.container()}>
        {label && <Text className={styles.label()}>{translate(label)}</Text>}

        <Pressable
          className={styles.input()}
          onPress={openPicker}
          disabled={disabled}
        >
          <View className="flex-1">
            <Text className={styles.inputValue()} numberOfLines={1}>
              {value ? dayjs(value).format(formattedDate) : ''}
            </Text>
          </View>

          <Icon
            type="feather"
            name="chevron-down"
            color={isDark ? colors.neutral[400] : colors.neutral[500]}
          />
        </Pressable>

        {error && <Text className="mt-1 text-sm text-danger-600">{error}</Text>}
      </View>

      {/* iOS — gorhom bottom sheet with gesture panning disabled so the spinner works */}
      {IS_IOS && (
        <Modal
          ref={modal.ref}
          snapPoints={['45%']}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
        >
          <View className="px-4">
            <View className="items-center justify-center rounded-xl bg-neutral-100 py-4 dark:bg-neutral-800">
              <DateTimePicker
                value={tempDate ?? new Date()}
                mode={mode}
                display="spinner"
                minimumDate={resolvedMinDate}
                maximumDate={resolvedMaxDate}
                onValueChange={onIOSChange}
                onDismiss={modal.dismiss}
                locale={language}
                themeVariant={colorScheme ?? undefined}
                textColor={isDark ? '#ffffff' : '#000000'}
                style={{ width: '100%' }}
              />
            </View>

            <Button
              label="common.confirm"
              className="mt-4"
              onPress={confirmIOSPicker}
            />
          </View>
        </Modal>
      )}

      {/* Android — native picker */}
      {IS_ANDROID && showAndroidPicker && (
        <DateTimePicker
          value={tempDate ?? new Date()}
          mode={mode === 'datetime' ? androidMode : mode}
          display="default"
          minimumDate={resolvedMinDate}
          maximumDate={resolvedMaxDate}
          onValueChange={onAndroidChange}
          onDismiss={() => setShowAndroidPicker(false)}
        />
      )}
    </>
  );
}
