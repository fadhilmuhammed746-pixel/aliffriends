import {
  initializeApp,
  getApps,
  getApp,
  cert,
  applicationDefault,
  type App,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

let adminApp: App | null = null;

function formatPrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  // Strip surrounding quotes if present
  if (formatted.startsWith('"') && formatted.endsWith('"')) {
    formatted = formatted.slice(1, -1);
  }
  // Replace escaped newlines with actual newlines
  return formatted.replace(/\\n/g, '\n');
}

/**
 * Initializes Firebase Admin SDK using available environment credentials
 */
export function getFirebaseAdminApp(): App | null {
  if (adminApp) return adminApp;
  if (getApps().length > 0 && getApps()[0]) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  try {
    // Option 1: Full service account JSON or base64 JSON
    if (serviceAccountRaw) {
      let saJson: ServiceAccount;
      if (serviceAccountRaw.trim().startsWith('{')) {
        saJson = JSON.parse(serviceAccountRaw);
      } else {
        const decoded = Buffer.from(serviceAccountRaw, 'base64').toString('utf8');
        saJson = JSON.parse(decoded);
      }
      adminApp = initializeApp({
        credential: cert(saJson),
        projectId: saJson.projectId || projectId,
        storageBucket:
          process.env.FIREBASE_STORAGE_BUCKET ||
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      return adminApp;
    }

    // Option 2: Discrete environment variables
    if (clientEmail && privateKey && projectId) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
        storageBucket:
          process.env.FIREBASE_STORAGE_BUCKET ||
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      return adminApp;
    }

    // Option 3: Explicit Google Application Credentials path
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      adminApp = initializeApp({
        credential: applicationDefault(),
        projectId,
        storageBucket:
          process.env.FIREBASE_STORAGE_BUCKET ||
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      return adminApp;
    }

    return null;
  } catch (error) {
    console.warn('Firebase Admin SDK initialization notice:', (error as Error)?.message || error);
    return null;
  }
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  );
}

export function getAdminAuth(): Auth | null {
  const app = getFirebaseAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminFirestore(): Firestore | null {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminStorage(): Storage | null {
  const app = getFirebaseAdminApp();
  return app ? getStorage(app) : null;
}

/**
 * Creates a Firebase custom authentication token with optional custom claims.
 * Used to bridge existing admin JWT sessions to Firebase.
 */
export async function createFirebaseCustomToken(
  uid: string,
  claims?: Record<string, any>
): Promise<string | null> {
  const authInstance = getAdminAuth();
  if (!authInstance) return null;
  return authInstance.createCustomToken(uid, claims);
}

/**
 * Verifies a Firebase ID token sent from the browser client.
 */
export async function verifyFirebaseIdToken(token: string): Promise<DecodedIdToken | null> {
  const authInstance = getAdminAuth();
  if (!authInstance) return null;
  try {
    return await authInstance.verifyIdToken(token);
  } catch {
    return null;
  }
}

/**
 * Sets custom claims on a user profile.
 */
export async function setFirebaseCustomClaims(
  uid: string,
  claims: Record<string, any>
): Promise<boolean> {
  const authInstance = getAdminAuth();
  if (!authInstance) return false;
  try {
    await authInstance.setCustomUserClaims(uid, claims);
    return true;
  } catch {
    return false;
  }
}
