'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { authApi } from '@/features/auth/services/authApi';
import type { Permission, User } from '@/types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hasPermission: (...needed: Permission[]) => boolean;
  hasSystemRole: (...names: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isAuthPage(pathname: string | null) {
  return !!pathname && (pathname.startsWith('/login') || pathname.startsWith('/register'));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!isAuthPage(pathname));

  const refresh = useCallback(async () => {
    try {
      const res = await authApi.me();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthPage(pathname)) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [pathname, refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setUser(res.data);
  }, []);

  const register = useCallback(async (payload: { email: string; password: string; name: string }) => {
    const res = await authApi.register(payload);
    setUser(res.data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const hasPermission = useCallback(
    (...needed: Permission[]) => {
      if (!user?.permissions?.length) return false;
      return needed.some((p) => user.permissions!.includes(p));
    },
    [user]
  );

  const hasSystemRole = useCallback(
    (...names: string[]) => {
      const roleNames = user?.roleNames || user?.roles?.map((r) => r.name) || [];
      return names.some((n) => roleNames.includes(n));
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refresh,
      hasPermission,
      hasSystemRole,
    }),
    [user, loading, login, register, logout, refresh, hasPermission, hasSystemRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
