/**
 * Modal
 * Dependencies:
 * - @gorhom/bottom-sheet.
 *
 * Props:
 * - All `BottomSheetModalProps` props.
 * - `title` (TxKeyPath | undefined): Optional title for the modal header.
 *
 * Usage Example:
 * import { Modal, useModal } from '@gorhom/bottom-sheet';
 *
 * function DisplayModal() {
 *   const { ref, present, dismiss, isOpen } = useModal();
 *
 *   return (
 *     <View>
 *       <Modal
 *         snapPoints={['60%']} // optional
 *         title="Modal Title"
 *         ref={ref}
 *       >
 *         Modal Content
 *       </Modal>
 *     </View>
 *   );
 * }
 *
 */

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import type { ForwardedRef } from 'react';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Pressable, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';

import { translate, type TxKeyPath } from '@/lib';

import { Text } from './text';

type ModalProps = Omit<BottomSheetModalProps, 'children'> & {
  title?: TxKeyPath;
  children?: React.ReactNode;
};

type ModalRef = ForwardedRef<BottomSheetModal>;

type ModalHeaderProps = {
  title?: TxKeyPath;
  titleClass?: string;
  dismiss: () => void;
};

export const useModal = () => {
  const ref = useRef<BottomSheetModal>(null);
  const present = useCallback((data?: never) => {
    ref.current?.present(data);
  }, []);
  const dismiss = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return { ref, present, dismiss };
};

export const Modal = forwardRef(
  (
    {
      snapPoints: _snapPoints = ['60%'],
      title,
      detached = false,
      children,
      ...props
    }: ModalProps,
    ref: ModalRef,
  ) => {
    const detachedProps = useMemo(() => getDetachedProps(detached), [detached]);
    const modal = useModal();
    const snapPoints = useMemo(() => _snapPoints, [_snapPoints]);
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const backgroundStyle = useMemo(
      () => ({ backgroundColor: isDark ? '#171717' : '#ffffff' }),
      [isDark],
    );
    const animationConfigs = useMemo(
      () => ({
        duration: 320,
        easing: Easing.ease,
      }),
      [],
    );

    useImperativeHandle(
      ref,
      () => (modal.ref.current as BottomSheetModal) || null,
    );

    const renderHandleComponent = useCallback(
      () => (
        <View className="mt-2 h-1 w-12 self-center rounded-lg bg-gray-400 dark:bg-gray-700" />
      ),
      [],
    );

    return (
      <BottomSheetModal
        stackBehavior="push"
        {...props}
        {...detachedProps}
        ref={modal.ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={props.backdropComponent ?? renderBackdrop}
        enableDynamicSizing={false}
        handleComponent={renderHandleComponent}
        backgroundStyle={backgroundStyle}
        animationConfigs={animationConfigs}
      >
        <ModalHeader title={title} dismiss={modal.dismiss} />
        {children}
      </BottomSheetModal>
    );
  },
);

export const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.4}
    pressBehavior="close"
  />
);

/**
 *
 * @param detached
 * @returns
 *
 * @description
 * In case the modal is detached, we need to add some extra props to the modal to make it look like a detached modal.
 */
const getDetachedProps = (detached: boolean) => {
  if (detached) {
    return {
      detached: true,
      bottomInset: 46,
      style: { marginHorizontal: 16, overflow: 'hidden' },
    } as Partial<BottomSheetModalProps>;
  }
  return {} as Partial<BottomSheetModalProps>;
};

/**
 * ModalHeader
 */
const ModalHeader = memo(({ title, titleClass, dismiss }: ModalHeaderProps) => (
  <View className="flex-row items-center px-4 pb-4 pt-2">
    {/* left spacer balances the close button so title stays centered */}
    <View className="w-6" />
    <Text
      className={`flex-1 text-center text-[18px] font-bold text-[#26313D] dark:text-white ${titleClass ?? ''}`}
      numberOfLines={1}
    >
      {title ? translate(title) : ''}
    </Text>
    <CloseButton close={dismiss} />
  </View>
));

const CloseButton = ({ close }: { close: () => void }) => (
  <Pressable
    onPress={close}
    className="size-6 items-center justify-center"
    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    accessibilityLabel="close modal"
    accessibilityRole="button"
    accessibilityHint="closes the modal"
  >
    <Svg
      className="fill-neutral-400 dark:fill-white"
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 24 24"
    >
      <Path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293Z" />
    </Svg>
  </Pressable>
);
