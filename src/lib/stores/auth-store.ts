import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { translate } from '@/lib/i18n';
import { queryClient } from '@/lib/providers/api-provider';
import { mmkvStorage } from '@/lib/storage';

import { createSelectors } from '../utils';

interface TokenState {
  accessToken: string;
  refreshToken: string;
  expireDate: Date;
}

interface UserDto {
  id?: string;
  name?: string | null;
  surname?: string | null;
  imageUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
  userName?: string | null;
}

interface AuthState {
  token?: TokenState;
  user?: UserDto;
  hydrated: boolean;
  signIn: (state: TokenState) => void;
  signOut: () => void;
}

const _useAuth = create<AuthState>()(
  persist(
    (set) => ({
      hydrated: false,

      signIn: (state) => {
        set({ token: state });
      },
      signOut: () => {
        set({ token: undefined });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        token: state.token,
      }),
      onRehydrateStorage: () => () => {
        _useAuth.setState({ hydrated: true });
      },
    },
  ),
);

export const useAuth = createSelectors(_useAuth);

export const performSignOut = (): void => {
  _useAuth.getState().signOut();

  queryClient.clear();
};

export const signOut = (): void => {
  Alert.alert(
    translate('settings.logout'),
    translate('settings.logoutConfirm.message'),
    [
      { text: translate('common.cancel'), style: 'cancel' },
      {
        text: translate('settings.logout'),
        style: 'destructive',
        onPress: performSignOut,
      },
    ],
  );
};
export const signIn = (state: TokenState) => _useAuth.getState().signIn(state);
