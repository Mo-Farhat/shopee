/**
 * Firebase Configuration
 * With AsyncStorage persistence for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    Auth,
    getAuth,
    // @ts-ignore
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKieuzEw_UumY7Ni70Rr_1lYN8iHCmDNg",
  authDomain: "shopee-94fd6.firebaseapp.com",
  projectId: "shopee-94fd6",
  storageBucket: "shopee-94fd6.firebasestorage.app",
  messagingSenderId: "396791680000",
  appId: "1:396791680000:web:acef3b480c3f4c7d661ce5",
  measurementId: "G-5BG3MCRYBE"
};

// Validate config before initializing
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence for React Native
let auth: Auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // Use AsyncStorage for React Native persistence
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error: any) {
    // If auth was already initialized, just get the existing instance
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      // Fallback to getAuth if initializeAuth fails
      auth = getAuth(app);
    }
  }
}

// Initialize Firestore
const db = getFirestore(app);

// Export instances
export { app, auth, db, isConfigured };

// Helper to check if Firebase is properly configured
export const checkFirebaseConfig = () => {
  if (!isConfigured) {
    console.warn(
      '⚠️ Firebase is not configured. Please update the firebaseConfig in services/firebase.ts'
    );
    return false;
  }
  return true;
};
