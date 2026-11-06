import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const video = db.getVideoById(id);
  if (!video) {
    return NextResponse.json({ error: 'Video not found.' }, { status: 404 });
  }
  return NextResponse.json({ video });
}

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
  const updated = db.updateVideo(id, body);
  if (!updated) {
    return NextResponse.json({ error: 'Video not found or update failed.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, video: updated });
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
  const deleted = db.deleteVideo(id);
  return NextResponse.json({ success: deleted });
}
