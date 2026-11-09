'use client';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './client';

export interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  role?: 'member' | 'editor' | 'admin';
  classBadge?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface UserPreferencesData {
  uid: string;
  readingFontSize?: 'small' | 'medium' | 'large';
  flipbookSound?: boolean;
  themePreference?: 'editorial-light' | 'midnight-dark';
  emailNotifications?: boolean;
  savedMagazines?: string[];
  favoriteArticles?: string[];
  updatedAt?: any;
}

export interface UserActivityLog {
  id?: string;
  type: 'read_magazine' | 'read_article' | 'watch_video' | 'download_app' | 'bookmark';
  title: string;
  targetId?: string;
  timestamp?: any;
}

/**
 * Retrieves user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  if (!db || !uid) return null;
  try {
    const docRef = doc(db, 'userProfiles', uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as UserProfileData;
  } catch (err) {
    console.warn('Firestore getUserProfile notice:', err);
    return null;
  }
}

/**
 * Saves or updates user profile in Firestore
 */
export async function saveUserProfile(uid: string, data: Partial<UserProfileData>): Promise<boolean> {
  if (!db || !uid) return false;
  try {
    const docRef = doc(db, 'userProfiles', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        uid,
        displayName: data.displayName || 'Alif Class Member',
        email: data.email || '',
        role: 'member',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...data,
      });
    }
    return true;
  } catch (err) {
    console.error('Firestore saveUserProfile error:', err);
    return false;
  }
}

/**
 * Subscribes to real-time updates for a user profile
 */
export function subscribeUserProfile(
  uid: string,
  callback: (profile: UserProfileData | null) => void
): Unsubscribe | null {
  if (!db || !uid) return null;
  try {
    const docRef = doc(db, 'userProfiles', uid);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as UserProfileData);
      } else {
        callback(null);
      }
    });
  } catch (err) {
    console.warn('Firestore subscribeUserProfile error:', err);
    return null;
  }
}

/**
 * Retrieves user preferences
 */
export async function getUserPreferences(uid: string): Promise<UserPreferencesData | null> {
  if (!db || !uid) return null;
  try {
    const docRef = doc(db, 'userPreferences', uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as UserPreferencesData;
  } catch (err) {
    console.warn('Firestore getUserPreferences notice:', err);
    return null;
  }
}

/**
 * Saves user preferences
 */
export async function saveUserPreferences(uid: string, data: Partial<UserPreferencesData>): Promise<boolean> {
  if (!db || !uid) return false;
  try {
    const docRef = doc(db, 'userPreferences', uid);
    await setDoc(
      docRef,
      {
        uid,
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Firestore saveUserPreferences error:', err);
    return false;
  }
}

/**
 * Logs an activity entry under userActivity/{uid}/logs
 */
export async function logUserActivity(uid: string, activity: Omit<UserActivityLog, 'id' | 'timestamp'>): Promise<string | null> {
  if (!db || !uid) return null;
  try {
    const colRef = collection(db, 'userActivity', uid, 'logs');
    const docAdded = await addDoc(colRef, {
      ...activity,
      timestamp: serverTimestamp(),
    });
    return docAdded.id;
  } catch (err) {
    console.debug('Firestore logUserActivity notice:', err);
    return null;
  }
}

/**
 * Retrieves latest activity logs for a user
 */
export async function getUserActivities(uid: string, count: number = 10): Promise<UserActivityLog[]> {
  if (!db || !uid) return [];
  try {
    const colRef = collection(db, 'userActivity', uid, 'logs');
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserActivityLog));
  } catch (err) {
    console.warn('Firestore getUserActivities notice:', err);
    return [];
  }
}
