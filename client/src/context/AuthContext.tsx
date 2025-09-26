import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../api/auth';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (payload: authApi.LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'transport-auth';

interface StoredAuth {
  token: string;
  user: User;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredAuth;
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  const persist = (value: StoredAuth | null) => {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (payload: authApi.LoginPayload) => {
    const response = await authApi.login(payload);
    setUser(response.user);
    setToken(response.token);
    persist({ user: response.user, token: response.token });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    persist(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      login,
      logout,
    }),
    [ready, user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
