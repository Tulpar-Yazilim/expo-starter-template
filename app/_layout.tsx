// Import  global CSS file
import '../global.css';
import '@/lib/i18n';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

import interceptors from '@/api/common/interceptors';
import {
  loadSelectedTheme,
  Providers,
  translate,
  useAppStore,
  useAuthProvider,
  useIsFirstTime,
  useSetupReactQueryLifecycle,
} from '@/lib';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

loadSelectedTheme();
interceptors();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

function GuardedStack() {
  const { isAuthenticated } = useAuthProvider();
  const [isFirstTime] = useIsFirstTime();

  return (
    <Stack>
      <Stack.Protected guard={isFirstTime}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen
          name="update-password"
          options={{
            title: translate('updatePassword.title'),
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>

      <Stack.Screen
        name="www"
        options={{
          presentation: 'modal',
          title: '',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useSetupReactQueryLifecycle();

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        const prevAppState = useAppStore.getState().currentAppState;
        if (prevAppState === nextAppState) {
          return;
        }

        useAppStore.setState({
          previousAppState: prevAppState,
          currentAppState: nextAppState,
        });
      },
    );
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  return (
    <Providers>
      <RouterContent />
    </Providers>
  );
}

function RouterContent() {
  const { ready } = useAuthProvider();
  const language = useAppStore((s) => s.language);

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (ready) {
      hideSplash();
    }
  }, [ready]);

  if (!ready) {
    return <Stack />;
  }

  return <GuardedStack key={language} />;
}
