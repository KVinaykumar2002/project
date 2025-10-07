import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken, isTokenValid, decodeToken, authAPI } from '../lib/auth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      
      if (token && isTokenValid(token)) {
        try {
          // Verify token with backend
          const response = await authAPI.getMe();
          if (response.user) {
            setUser(response.user);
          } else {
            removeAuthToken();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          removeAuthToken();
        }
      } else {
        removeAuthToken();
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signUp = async (email, password, fullName) => {
    try {
      const response = await authAPI.signup(email, password, fullName);
      
      if (response.token) {
        setAuthToken(response.token);
        setUser(response.user);
        return { data: response, error: null };
      } else {
        return { data: null, error: response.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error: error.message || 'Network error' };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.signin(email, password);
      
      if (response.token) {
        setAuthToken(response.token);
        setUser(response.user);
        return { data: response, error: null };
      } else {
        return { data: null, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error: error.message || 'Network error' };
    }
  };

  const signOut = async () => {
    try {
      // Call backend signout (optional)
      await authAPI.signout();
      
      // Remove token and clear user state
      removeAuthToken();
      setUser(null);
      
      return { error: null };
    } catch (error) {
      console.error('Signout error:', error);
      // Even if backend call fails, clear local state
      removeAuthToken();
      setUser(null);
      return { error: null };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
