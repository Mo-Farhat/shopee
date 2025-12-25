/**
 * Authentication Service
 * Handles all Firebase authentication operations
 */

import type { User, UserPreferences } from '@/types';
import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, checkFirebaseConfig, db } from './firebase';

// Default user preferences
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  notifications: true,
};

/**
 * Create a new user account with email and password
 */
export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  if (!checkFirebaseConfig()) {
    throw new Error('Firebase is not configured');
  }

  try {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name
    try {
      await updateProfile(firebaseUser, { displayName });
    } catch (profileError: any) {
      console.log('Could not update profile:', profileError.message);
    }

    // Build user data
    const userData: Omit<User, 'id'> = {
      email: firebaseUser.email!,
      displayName,
      photoURL: firebaseUser.photoURL || null as any, // Firestore doesn't like undefined
      createdAt: null as any,
      updatedAt: null as any,
      preferences: defaultPreferences,
    };

    // Try to create user document in Firestore
    try {
      const cleanData = {
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        preferences: userData.preferences,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), cleanData);
    } catch (firestoreError: any) {
      console.error('Could not save user to Firestore:', firestoreError.message);
      // We don't throw here to allow the user to be "signed in" even if Firestore fails
      // but we should probably log it properly.
    }

    return {
      id: firebaseUser.uid,
      ...userData,
    };
  } catch (error: any) {
    console.error('Sign-up error:', error.code, error.message);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  if (!checkFirebaseConfig()) {
    throw new Error('Firebase is not configured');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Try to get user data from Firestore, but don't fail if permissions are missing
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        return {
          id: firebaseUser.uid,
          ...userDoc.data() as Omit<User, 'id'>,
        };
      }
    } catch (firestoreError: any) {
      console.log('Firestore access limited during sign-in, using auth data:', firestoreError.message);
    }

    // If user doc doesn't exist or Firestore failed, create basic user object
    const userData: Omit<User, 'id'> = {
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || 'User',
      photoURL: firebaseUser.photoURL || null as any,
      createdAt: null as any,
      updatedAt: null as any,
      preferences: defaultPreferences,
    };

    // Try to save user doc, but don't fail if permissions are missing
    try {
      const cleanData = {
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        preferences: userData.preferences,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), cleanData);
    } catch (saveError: any) {
      console.log('Could not save user to Firestore:', saveError.message);
    }

    return {
      id: firebaseUser.uid,
      ...userData,
    };
  } catch (error: any) {
    console.error('Sign-in error:', error.code, error.message);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  if (!checkFirebaseConfig()) {
    throw new Error('Firebase is not configured');
  }
  await sendPasswordResetEmail(auth, email);
};

/**
 * Get current user data from Firestore
 */
export const getCurrentUserData = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  
  if (userDoc.exists()) {
    return {
      id: uid,
      ...userDoc.data() as Omit<User, 'id'>,
    };
  }
  
  return null;
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (
  uid: string,
  preferences: Partial<UserPreferences>
): Promise<void> => {
  await setDoc(
    doc(db, 'users', uid),
    {
      preferences,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
export const getAuthErrorMessage = (errorCode: string): string => {
  // Handle both full error strings and just codes
  const code = errorCode.includes('(') 
    ? errorCode.match(/\(([^)]+)\)/)?.[1] || errorCode 
    : errorCode;

  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };

  return errorMessages[code] || errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};
