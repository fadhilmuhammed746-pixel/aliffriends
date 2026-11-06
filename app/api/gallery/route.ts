import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const albums = db.getAlbums(!all);
  return NextResponse.json({ albums });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, coverImage, photos } = body;

    if (!title || !category || !coverImage) {
      return NextResponse.json(
        { error: 'Required fields: title, category, coverImage' },
        { status: 400 }
      );
    }

    const newAlbum = db.createAlbum({
      title,
      category,
      description: body.description || '',
      coverImage,
      isRestricted: Boolean(body.isRestricted),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      photos: photos || [],
    });

    return NextResponse.json({ success: true, album: newAlbum });
  } catch (err) {
    console.error('Create album error:', err);
    return NextResponse.json({ error: 'Failed to create album.' }, { status: 500 });
  }
}
