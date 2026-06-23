import React, {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useState,
  useTransition,
} from 'react';
import ImageView from 'react-native-image-viewing';

type ImageItem = { uri: string };

interface ContextType {
  open: (images: Array<ImageItem>, index?: number) => void;
  close: () => void;
}

const ImageViewerContext = createContext<ContextType | null>(null);

export const ImageViewerProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState<Array<ImageItem>>([]);
  const [index, setIndex] = useState(0);
  const [, startTransition] = useTransition();

  const open = useCallback((imgs: Array<ImageItem>, idx = 0) => {
    requestIdleCallback(() => {
      startTransition(() => {
        setImages(imgs);
        setIndex(idx);
        setVisible(true);
      });
    });
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setImages([]);
    setIndex(0);
  }, []);

  return (
    <ImageViewerContext.Provider value={{ open, close }}>
      {children}

      {visible && images.length > 0 && (
        <ImageView
          images={images}
          imageIndex={index}
          visible
          onRequestClose={close}
          presentationStyle="overFullScreen"
          swipeToCloseEnabled
          animationType="fade"
        />
      )}
    </ImageViewerContext.Provider>
  );
};

export const useImageViewer = () => {
  const ctx = useContext(ImageViewerContext);
  if (!ctx) {
    throw new Error('useImageViewer must be used inside ImageViewerProvider');
  }
  return ctx;
};
