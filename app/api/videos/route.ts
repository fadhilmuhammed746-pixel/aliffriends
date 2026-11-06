import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const videos = db.getVideos(!all);
  return NextResponse.json({ videos });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, videoType, thumbnailUrl } = body;

    if (!title || !category || !thumbnailUrl) {
      return NextResponse.json(
        { error: 'Required fields: title, category, thumbnailUrl' },
        { status: 400 }
      );
    }

    const newVideo = db.createVideo({
      title,
      description: description || '',
      category,
      videoType: videoType || 'youtube',
      youtubeUrl: body.youtubeUrl || '',
      videoUrl: body.videoUrl || '',
      thumbnailUrl,
      duration: body.duration || '0:00',
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      collectionName: body.collectionName || 'Cinematic Archives',
    });

    return NextResponse.json({ success: true, video: newVideo });
  } catch (err) {
    console.error('Create video error:', err);
    return NextResponse.json({ error: 'Failed to create video.' }, { status: 500 });
  }
}
