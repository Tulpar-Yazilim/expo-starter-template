import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from 'expo-router';
import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APIProvider } from '../providers/api-provider';
import { AuthProvider, useAuthProvider } from '../providers/auth-provider';
import {
  ImageViewerProvider,
  useImageViewer,
} from '../providers/image-view-provider';
import { NotificationProvider } from '../providers/notification-provider';
import { useThemeConfig } from '../use-theme-config';

export {
  APIProvider,
  AuthProvider,
  ImageViewerProvider,
  NotificationProvider,
  useAuthProvider,
  useImageViewer,
};

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const theme = useThemeConfig();

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider value={theme}>
            <APIProvider>
              <AuthProvider>
                <NotificationProvider>
                  <ImageViewerProvider>
                    <BottomSheetModalProvider>
                      {children}
                      <FlashMessage position="top" />
                    </BottomSheetModalProvider>
                  </ImageViewerProvider>
                </NotificationProvider>
              </AuthProvider>
            </APIProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
