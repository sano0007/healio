'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { saveAuth, clearAuth, getToken, getUser, StoredUser } from '@/lib/auth';
import { api, AuthResponse } from '@/lib/api';

interface AuthContextValue {
  user: StoredUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setToken(getToken());
    setUser(getUser());
    setIsLoading(false);
  }, []);

  function persist(res: AuthResponse) {
    saveAuth(res.access_token, res.user);
    setToken(res.access_token);
    setUser(res.user);
  }

  async function login(email: string, password: string) {
    const res = await api.auth.login({ email, password });
    persist(res);
  }

  async function register(name: string, email: string, password: string, role: string) {
    const res = await api.auth.register({ name, email, password, role });
    persist(res);
  }

  function logout() {
    clearAuth();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
