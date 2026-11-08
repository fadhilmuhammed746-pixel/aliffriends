import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const achievements = await db.getAchievements(!all);
  return NextResponse.json({ achievements });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, date, description, imageUrl } = body;

    if (!title || !category || !date || !imageUrl) {
      return NextResponse.json(
        { error: 'Required fields: title, category, date, imageUrl' },
        { status: 400 }
      );
    }

    const newAch = await db.createAchievement({
      title,
      category,
      date,
      description: description || '',
      awardedBy: body.awardedBy || '',
      imageUrl,
      photos: body.photos || [],
      videoUrl: body.videoUrl || undefined,
      pdfUrl: body.pdfUrl || undefined,
      pdfTitle: body.pdfTitle || undefined,
      badgeTitle: body.badgeTitle || '',
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    });

    return NextResponse.json({ success: true, achievement: newAch });
  } catch (err) {
    console.error('Create achievement error:', err);
    return NextResponse.json({ error: 'Failed to create achievement.' }, { status: 500 });
  }
}

