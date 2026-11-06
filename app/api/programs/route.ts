import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const programs = db.getPrograms(!all);
  return NextResponse.json({ programs });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, date, location, description, coverImage } = body;

    if (!title || !category || !date || !location || !coverImage) {
      return NextResponse.json(
        { error: 'Required fields: title, category, date, location, coverImage' },
        { status: 400 }
      );
    }

    const newProg = db.createProgram({
      title,
      category,
      date,
      location,
      description: description || '',
      coverImage,
      photos: body.photos || [],
      youtubeUrl: body.youtubeUrl || '',
      videoUrl: body.videoUrl || '',
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    });

    return NextResponse.json({ success: true, program: newProg });
  } catch (err) {
    console.error('Create program error:', err);
    return NextResponse.json({ error: 'Failed to create program.' }, { status: 500 });
  }
}
