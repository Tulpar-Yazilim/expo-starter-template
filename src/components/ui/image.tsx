import type { ImageProps, ImageSource } from 'expo-image';
import { Image as NImage } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useCallback, useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-worklets';

import * as Images from '../../../assets';
import { useImageViewer } from '../../lib/providers';

type ImagesTypes = keyof typeof Images;

export type ImgProps = ImageProps & {
  className?: string;
  source: ImagesTypes | number | ImageSource;
  canFullScreen?: boolean;
  images?: Array<string | null>;
};

cssInterop(NImage, { className: 'style' });

function resolveSource(source: ImgProps['source']) {
  if (typeof source === 'string' && source in Images) {
    // eslint-disable-next-line import/namespace
    return Images[source as never];
  }

  return source;
}

export const Image = ({
  style,
  className,
  placeholder = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
  source,
  canFullScreen = false,
  images = [],
  ...props
}: ImgProps) => {
  const { open } = useImageViewer();

  // Memoize image array to prevent unnecessary re-renders
  const openableImages = useMemo(
    () => images?.map((img) => ({ uri: img! })),
    [images],
  );

  const handleOpen = useCallback(() => {
    if (!openableImages?.length) {
      return;
    }
    open(openableImages, 0);
  }, [images, open]);

  const tapGesture = Gesture.Tap()
    .enabled(canFullScreen)
    .onEnd(() => {
      runOnJS(handleOpen)();
    });

  return (
    <GestureDetector gesture={tapGesture}>
      <NImage
        className={className}
        placeholder={placeholder}
        style={style}
        source={resolveSource(source)}
        contentFit="contain"
        contentPosition="center"
        {...props}
      />
    </GestureDetector>
  );
};

export const preloadImages = (sources: Array<string>) => {
  NImage.prefetch(sources);
};
