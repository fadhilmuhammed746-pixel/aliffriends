import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { createFirebaseCustomToken, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

export async function POST() {
  try {
    // 1. Validate existing admin JWT session on the server
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Valid administrator session required to generate Firebase credentials.' },
        { status: 401 }
      );
    }

    // 2. Check if Firebase Admin SDK credentials are configured
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'Firebase Admin credentials are not yet configured in environment variables.',
      });
    }

    // 3. Generate a Firebase custom token with verified admin claim
    // Browser users CANNOT forge or grant this claim to themselves
    const customToken = await createFirebaseCustomToken(session.id || session.username, {
      admin: true,
      role: 'admin',
      username: session.username,
      issuer: 'alif-friends-12-auth-bridge',
    });

    if (!customToken) {
      return NextResponse.json(
        { error: 'Failed to mint Firebase custom token via Admin SDK.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      configured: true,
      customToken,
      uid: session.id || session.username,
      username: session.username,
      role: 'admin',
    });
  } catch (error: any) {
    console.error('Firebase Auth bridge error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal error in Firebase authentication bridge.' },
      { status: 500 }
    );
  }
}
