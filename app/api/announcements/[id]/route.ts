import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updated = db.updateAnnouncement(id, body);
  if (!updated) {
    return NextResponse.json({ error: 'Announcement not found or update failed.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, announcement: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = db.deleteAnnouncement(id);
  return NextResponse.json({ success: deleted });
}
