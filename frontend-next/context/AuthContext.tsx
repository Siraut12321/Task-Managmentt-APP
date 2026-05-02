'use client';

import { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  authChecked: boolean;
  loginPrompt: boolean;
  setLoginPrompt: (v: boolean) => void;
  login: (token: string, name: string, email: string) => void;
  logout: () => void;
  requireAuth: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name  = localStorage.getItem('name') ?? '';
    const email = localStorage.getItem('email') ?? '';
    if (token) setUser({ name, email });
    setAuthChecked(true);
  }, []);

  const login = (token: string, name: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    setUser({ name, email });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const requireAuth = useCallback((): boolean => {
    if (user) return true;
    setLoginPrompt(true);
    return false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, authChecked, loginPrompt, setLoginPrompt, login, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
