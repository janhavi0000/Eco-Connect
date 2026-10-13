import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecoconnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [recycler, setRecycler] = useState(() => {
    const saved = localStorage.getItem('ecoconnect_recycler');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ecoconnect_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('ecoconnect_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data.data.user);
          setRecycler(res.data.data.recycler || null);
          localStorage.setItem('ecoconnect_user', JSON.stringify(res.data.data.user));
          if (res.data.data.recycler) {
            localStorage.setItem('ecoconnect_recycler', JSON.stringify(res.data.data.recycler));
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token: newToken, user: newUser, recycler: newRecycler } = res.data.data;

    setToken(newToken);
    setUser(newUser);
    setRecycler(newRecycler || null);

    localStorage.setItem('ecoconnect_token', newToken);
    localStorage.setItem('ecoconnect_user', JSON.stringify(newUser));
    if (newRecycler) {
      localStorage.setItem('ecoconnect_recycler', JSON.stringify(newRecycler));
    } else {
      localStorage.removeItem('ecoconnect_recycler');
    }

    return res.data;
  };

  const register = async (registrationData) => {
    const res = await authService.register(registrationData);
    const { token: newToken, user: newUser, recycler: newRecycler } = res.data.data;

    setToken(newToken);
    setUser(newUser);
    setRecycler(newRecycler || null);

    localStorage.setItem('ecoconnect_token', newToken);
    localStorage.setItem('ecoconnect_user', JSON.stringify(newUser));
    if (newRecycler) {
      localStorage.setItem('ecoconnect_recycler', JSON.stringify(newRecycler));
    }

    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRecycler(null);
    localStorage.removeItem('ecoconnect_token');
    localStorage.removeItem('ecoconnect_user');
    localStorage.removeItem('ecoconnect_recycler');
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      setUser(res.data.data.user);
      setRecycler(res.data.data.recycler || null);
      localStorage.setItem('ecoconnect_user', JSON.stringify(res.data.data.user));
      if (res.data.data.recycler) {
        localStorage.setItem('ecoconnect_recycler', JSON.stringify(res.data.data.recycler));
      }
    } catch (err) {
      console.error('[AuthContext] Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        recycler,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
