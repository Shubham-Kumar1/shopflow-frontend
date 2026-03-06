'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data, error } = await api.post('/api/users/login', { email, password });
    if (error) return { error };
    const payload = data.data || data;
    const userData = payload.user;
    const userToken = payload.accessToken;
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    if (payload.refreshToken) {
      localStorage.setItem('refreshToken', payload.refreshToken);
    }
    return { data: payload };
  };

  const register = async (firstName, lastName, email, password) => {
    const { data, error } = await api.post('/api/users/register', {
      firstName,
      lastName,
      email,
      password,
    });
    if (error) return { error };
    const payload = data.data || data;
    const userData = payload.user;
    const userToken = payload.accessToken;
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    if (payload.refreshToken) {
      localStorage.setItem('refreshToken', payload.refreshToken);
    }
    return { data: payload };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
