import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const announcements = db.getAnnouncements(!all);
  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, date, content, priority } = body;

    if (!title || !category || !date || !content) {
      return NextResponse.json(
        { error: 'Required fields: title, category, date, content' },
        { status: 400 }
      );
    }

    const newAnn = db.createAnnouncement({
      title,
      category,
      date,
      content,
      priority: priority || 'medium',
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    });

    return NextResponse.json({ success: true, announcement: newAnn });
  } catch (err) {
    console.error('Create announcement error:', err);
    return NextResponse.json({ error: 'Failed to create announcement.' }, { status: 500 });
  }
}
