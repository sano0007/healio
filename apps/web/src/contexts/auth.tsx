'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  clearAuth,
  getRefreshToken,
  getToken,
  getUser,
  saveAuth,
  StoredUser,
} from '@/lib/auth';
import {
  api,
  AuthResponse,
  clearAuthTokens,
  getAccessToken,
  setAuthTokens,
} from '@/lib/api';

interface AuthContextValue {
  user: StoredUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<StoredUser>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
    phone?: string,
  ) => Promise<StoredUser>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();
    const storedRefreshToken = getRefreshToken();
    if (storedToken) {
      setToken(storedToken);
      setAuthTokens(storedToken, storedRefreshToken || undefined);
    }
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const handleAuthResponse = useCallback((res: AuthResponse) => {
    saveAuth(res.access_token, res.user, res.refresh_token);
    setAuthTokens(res.access_token, res.refresh_token);
    setToken(res.access_token);
    setUser(res.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.auth.login({ email, password });
      handleAuthResponse(res);
      return res.user;
    },
    [handleAuthResponse],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: string,
      phone?: string,
    ) => {
      const res = await api.auth.register({
        name,
        email,
        password,
        role,
        phone,
      });
      handleAuthResponse(res);
      return res.user;
    },
    [handleAuthResponse],
  );

  const logout = useCallback(() => {
    clearAuth();
    clearAuthTokens();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export { getAccessToken };
