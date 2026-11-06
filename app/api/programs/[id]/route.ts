import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const program = db.getProgramById(id);
  if (!program) {
    return NextResponse.json({ error: 'Program not found.' }, { status: 404 });
  }
  return NextResponse.json({ program });
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
  const updated = db.updateProgram(id, body);
  if (!updated) {
    return NextResponse.json({ error: 'Program not found or update failed.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, program: updated });
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
  const deleted = db.deleteProgram(id);
  return NextResponse.json({ success: deleted });
}
