import dayjs from 'dayjs';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { signOut, useAuth } from '../stores';

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  ready: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const checkToken = useCallback(() => {
    if (!token || !token.expireDate) {
      signOut();
      setLoading(false);
      setReady(true);
      return;
    }

    const isExpired = dayjs().isAfter(dayjs(token.expireDate));

    if (isExpired) {
      signOut(); // Token expired, clear it
    }

    setLoading(false);
    setReady(true);
  }, [token]);

  useEffect(() => {
    checkToken();
  }, []);

  const values = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      loading,
      ready,
    }),
    [loading, ready, token],
  );
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthProvider = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
