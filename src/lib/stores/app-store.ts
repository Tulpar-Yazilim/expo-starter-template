import { AppState, type AppStateStatus } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type Language } from '../i18n';
import { mmkvStorage } from '../storage';

interface AppStore {
  hydrated: boolean;
  language?: Language;
  appVersion: string;
  previousAppState: AppStateStatus;
  currentAppState: AppStateStatus;
  changeLanguage: (language: Language) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      hydrated: false,
      language: 'en',
      appVersion: '',
      previousAppState: AppState.currentState,
      currentAppState: AppState.currentState,
      changeLanguage: (language: Language) => {
        set({
          language,
        });
      },
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        language: state.language,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hydrated: true });
      },
    },
  ),
);
