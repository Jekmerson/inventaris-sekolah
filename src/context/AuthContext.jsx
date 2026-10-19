import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('inventaris_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('inventaris_token'));
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('inventaris_token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      localStorage.setItem('inventaris_user', JSON.stringify(res.data.user));
    } catch (err) {
      console.warn('Auth verification failed:', err.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('inventaris_token');
      localStorage.removeItem('inventaris_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const res = await authAPI.login({ username, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem('inventaris_token', receivedToken);
    localStorage.setItem('inventaris_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // ignore logout network errors
    } finally {
      localStorage.removeItem('inventaris_token');
      localStorage.removeItem('inventaris_user');
      setUser(null);
      setToken(null);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    const res = await authAPI.changePassword({
      old_password: oldPassword,
      new_password: newPassword
    });
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        logout,
        changePassword,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
