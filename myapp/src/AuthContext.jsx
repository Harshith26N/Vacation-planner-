// frontend/src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './utils/api'; // Our axios instance

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check authentication status
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/check-auth');
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []); // Empty dependency array means it's created once

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed.' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/register', { username, email, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};