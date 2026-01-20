import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APIProvider } from '../providers/api-provider';
import { AuthProvider, useAuthProvider } from '../providers/auth-provider';
import { useThemeConfig } from '../use-theme-config';

export { APIProvider, AuthProvider, useAuthProvider };

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
                <BottomSheetModalProvider>
                  {children}
                  <FlashMessage position="top" />
                </BottomSheetModalProvider>
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
