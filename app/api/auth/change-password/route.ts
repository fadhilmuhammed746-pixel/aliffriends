import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, comparePassword, hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmNewPassword } = body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { error: 'All fields (current password, new password, confirm password) are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const admin = db.getAdminByUsername(session.username);
    if (!admin) {
      return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
    }

    const isCurrentValid = await comparePassword(currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: 'Current password entered is incorrect.' },
        { status: 400 }
      );
    }

    // Hash new password securely with bcrypt
    const newHash = await hashPassword(newPassword);
    const updated = db.updateAdminPassword(admin.id, newHash);

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update administrator password in database.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Administrator password has been securely updated.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error while changing password.' },
      { status: 500 }
    );
  }
}

