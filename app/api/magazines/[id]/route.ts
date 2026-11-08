import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const magazine = await db.getMagazineById(id);
  if (!magazine) {
    return NextResponse.json({ error: 'Magazine not found.' }, { status: 404 });
  }
  return NextResponse.json({ magazine });
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
  const updated = await db.updateMagazine(id, body);
  if (!updated) {
    return NextResponse.json({ error: 'Magazine not found or failed to update.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, magazine: updated });
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
  const deleted = await db.deleteMagazine(id);
  return NextResponse.json({ success: deleted });
}

