'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_path?: string;
  home_city?: string;
  bio?: string;
  locale?: string;
  theme?: string;
  text_size?: string;
  email_prefs?: { reports: boolean; updates: boolean };
  created_at?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  csrfToken: string;
  login: (email: string, password: string, remember?: boolean) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; acceptPrivacy: boolean }) => Promise<{ ok: boolean; error?: string; fields?: Record<string, string[]> }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user || null);
      setCsrfToken(getCookie('cp_csrf'));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string, remember = false) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        await refreshUser();
        return { ok: true };
      }
      return { ok: false, error: data.error || 'Login failed.' };
    } catch {
      return { ok: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (formData: { name: string; email: string; password: string; acceptPrivacy: boolean }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        await refreshUser();
        return { ok: true };
      }
      return { ok: false, error: data.error || 'Registration failed.', fields: data.fields };
    } catch {
      return { ok: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setCsrfToken('');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, csrfToken, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
