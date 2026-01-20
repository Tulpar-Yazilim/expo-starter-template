import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/lib/storage';

import { createSelectors } from '../utils';

interface TokenState {
  accessToken: string;
  refreshToken: string;
  expireDate: Date;
}

interface AuthState {
  token?: TokenState;
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

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (state: TokenState) => _useAuth.getState().signIn(state);
