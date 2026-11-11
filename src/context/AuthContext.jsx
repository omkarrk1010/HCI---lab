import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, isSupabaseConfigured, supabaseClient } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const activeSession = await authService.getSession();
        if (isMounted) {
          if (activeSession && activeSession.user) {
            setUser(activeSession.user);
            setSession(activeSession);
          } else {
            setUser(null);
            setSession(null);
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        if (isMounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Supabase real-time auth state listener if active
    let authListener = null;
    if (isSupabaseConfigured && supabaseClient) {
      const { data } = supabaseClient.auth.onAuthStateChange((event, newSession) => {
        if (!isMounted) return;
        if (newSession?.user) {
          setUser({
            id: newSession.user.id,
            email: newSession.user.email,
            name: newSession.user.user_metadata?.full_name || newSession.user.email.split('@')[0],
            createdAt: newSession.user.created_at
          });
          setSession(newSession);
        } else {
          setUser(null);
          setSession(null);
        }
      });
      authListener = data?.subscription;
    }

    // Periodic check for session expiration (every 60 seconds)
    const expiryInterval = setInterval(async () => {
      try {
        const s = await authService.getSession();
        if (!s && isMounted && user) {
          setUser(null);
          setSession(null);
        }
      } catch {
        // Ignored
      }
    }, 60000);

    return () => {
      isMounted = false;
      if (authListener) authListener.unsubscribe();
      clearInterval(expiryInterval);
    };
  }, []);

  const login = useCallback(async (email, password, rememberMe = true) => {
    setAuthError(null);
    try {
      const result = await authService.signIn({ email, password, rememberMe });
      setUser(result.user);
      setSession(result.session);
      return result;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setAuthError(null);
    try {
      const result = await authService.signUp({ name, email, password });
      setUser(result.user);
      setSession(result.session);
      return result;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.signOut();
    } finally {
      setUser(null);
      setSession(null);
      setAuthError(null);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    setAuthError(null);
    try {
      return await authService.resetPassword(email);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const value = {
    user,
    session,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    authProviderType: authService.getProviderType(),
    login,
    signup,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
