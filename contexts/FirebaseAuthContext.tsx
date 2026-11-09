'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithCustomToken,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase/client';

interface FirebaseAuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isFirebaseConfigured: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  registerWithEmail: (email: string, pass: string, displayName?: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  syncAdminSession: () => Promise<boolean>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null);

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check custom claims for admin privileges
  const checkAdminClaims = useCallback(async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setIsAdmin(false);
      return;
    }
    try {
      const idTokenResult = await firebaseUser.getIdTokenResult(true);
      const hasAdminClaim = Boolean(
        idTokenResult.claims.admin === true ||
        idTokenResult.claims.role === 'admin'
      );
      setIsAdmin(hasAdminClaim);
    } catch {
      setIsAdmin(false);
    }
  }, []);

  // Sync existing Next.js Admin session with Firebase via custom token
  const syncAdminSession = useCallback(async (): Promise<boolean> => {
    if (!auth || !isFirebaseConfigured) return false;
    try {
      const res = await fetch('/api/auth/firebase-bridge', { method: 'POST' });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.success && data.customToken) {
        const userCredential = await signInWithCustomToken(auth, data.customToken);
        await checkAdminClaims(userCredential.user);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Firebase admin bridge sync notice:', err);
      return false;
    }
  }, [checkAdminClaims]);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await checkAdminClaims(currentUser);
      setLoading(false);
    });

    // Auto-attempt admin bridge sync if on admin route
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      syncAdminSession();
    }

    return () => unsubscribe();
  }, [checkAdminClaims, syncAdminSession]);

  const loginWithEmail = async (email: string, pass: string): Promise<User> => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await checkAdminClaims(cred.user);
    return cred.user;
  };

  const registerWithEmail = async (email: string, pass: string, displayName?: string): Promise<User> => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    await checkAdminClaims(cred.user);
    return cred.user;
  };

  const logout = async (): Promise<void> => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async (): Promise<void> => {
    if (!auth || !auth.currentUser) throw new Error('No signed-in user found.');
    await sendEmailVerification(auth.currentUser);
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isFirebaseConfigured,
        loginWithEmail,
        registerWithEmail,
        logout,
        resetPassword,
        sendVerificationEmail,
        syncAdminSession,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = (): FirebaseAuthContextValue => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};
