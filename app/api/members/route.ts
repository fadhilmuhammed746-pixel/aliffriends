import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const members = await db.getMembers(!all);
  return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, position, bio, photoUrl } = body;

    if (!name || !position || !bio || !photoUrl) {
      return NextResponse.json(
        { error: 'Required fields: name, position, bio, photoUrl' },
        { status: 400 }
      );
    }

    const newMem = await db.createMember({
      name,
      position,
      bio,
      photoUrl,
      quote: body.quote || '',
      orderIndex: body.orderIndex || 99,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    });

    return NextResponse.json({ success: true, member: newMem });
  } catch (err) {
    console.error('Create member error:', err);
    return NextResponse.json({ error: 'Failed to create member.' }, { status: 500 });
  }
}

