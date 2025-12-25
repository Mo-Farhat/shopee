/**
 * Authentication Context
 * Manages auth state across the entire app
 */

import {
    logout as authLogout,
    resetPassword as authResetPassword,
    signIn as authSignIn,
    signUp as authSignUp,
    getAuthErrorMessage,
    getCurrentUserData,
    subscribeToAuthState,
} from '@/services/auth';
import type { AuthState, User } from '@/types';
import { User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Context type
interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

// Default context value
const defaultContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  clearError: () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultContext);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Try to get user data from Firestore, but don't fail if permissions are missing
          let userData: User | null = null;
          try {
            userData = await getCurrentUserData(firebaseUser.uid);
          } catch (firestoreError: any) {
            // Handle Firestore permission errors gracefully
            console.log('Firestore access limited, using auth data only:', firestoreError.message);
          }
          
          if (userData) {
            setUser(userData);
          } else {
            // User exists in Auth but not in Firestore (or Firestore access failed)
            // Create a user object from Firebase Auth data
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || undefined,
              createdAt: null as any,
              updatedAt: null as any,
              preferences: { theme: 'dark', notifications: true },
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error in auth state handler:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign up handler
  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const newUser = await authSignUp(email, password, displayName);
      setUser(newUser);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code || '');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign in handler
  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const userData = await authSignIn(email, password);
      setUser(userData);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code || '');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out handler
  const signOut = useCallback(async () => {
    setError(null);
    try {
      await authLogout();
      setUser(null);
    } catch (err: any) {
      const message = 'Failed to sign out. Please try again.';
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Reset password handler
  const resetPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await authResetPassword(email);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code || '');
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
