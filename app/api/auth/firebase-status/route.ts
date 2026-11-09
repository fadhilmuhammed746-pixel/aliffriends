import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { isFirebaseAdminConfigured, getAdminFirestore, getAdminAuth } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasClientApiKey = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    const hasClientProjectId = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    const hasClientStorage = Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    const hasClientAppId = Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
    const hasMeasurementId = Boolean(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);

    const clientConfigured = hasClientApiKey && hasClientProjectId && hasClientAppId;
    const adminConfigured = isFirebaseAdminConfigured();

    let firestoreConnected = false;
    let authConnected = false;
    let totalFirebaseUsers = 0;

    if (adminConfigured) {
      try {
        const auth = getAdminAuth();
        if (auth) {
          const listUsers = await auth.listUsers(10);
          totalFirebaseUsers = listUsers.users.length;
          authConnected = true;
        }
      } catch {
        authConnected = false;
      }

      try {
        const firestore = getAdminFirestore();
        if (firestore) {
          // Check collections safely
          const collections = await firestore.listCollections();
          firestoreConnected = true;
        }
      } catch {
        firestoreConnected = false;
      }
    }

    return NextResponse.json({
      success: true,
      services: {
        analytics: {
          available: hasMeasurementId && clientConfigured,
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || null,
        },
        auth: {
          clientAvailable: clientConfigured,
          adminAvailable: adminConfigured,
          active: authConnected,
          userCount: totalFirebaseUsers,
        },
        firestore: {
          clientAvailable: clientConfigured,
          adminAvailable: adminConfigured,
          connected: firestoreConnected,
        },
        storage: {
          bucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || null,
          available: Boolean(hasClientStorage && clientConfigured),
        },
      },
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'Not Configured',
      clientConfigured,
      adminConfigured,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to check Firebase status',
    }, { status: 500 });
  }
}
