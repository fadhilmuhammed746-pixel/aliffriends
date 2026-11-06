import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const settings = db.getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const updated = db.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error('Update settings error:', err);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
