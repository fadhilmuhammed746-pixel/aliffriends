import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'all';
    const section = searchParams.get('section') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    let mediaList = await db.getMedia();

    // 1. Search filter
    if (search) {
      mediaList = mediaList.filter(
        (m) =>
          m.filename.toLowerCase().includes(search) ||
          m.originalName?.toLowerCase().includes(search) ||
          m.section?.toLowerCase().includes(search)
      );
    }

    // 2. Category filter
    if (category !== 'all') {
      mediaList = mediaList.filter((m) => m.category === category);
    }

    // 3. Section filter
    if (section !== 'all') {
      mediaList = mediaList.filter((m) => (m.section || 'general').toLowerCase() === section.toLowerCase());
    }

    // 4. Sort
    if (sort === 'oldest') {
      mediaList = [...mediaList].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sort === 'largest') {
      mediaList = [...mediaList].sort((a, b) => (b.size || 0) - (a.size || 0));
    } else if (sort === 'smallest') {
      mediaList = [...mediaList].sort((a, b) => (a.size || 0) - (b.size || 0));
    } else {
      // Default: newest
      mediaList = [...mediaList].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Attach usage metadata
    const mediaWithUsage = await Promise.all(
      mediaList.map(async (m) => {
        const usage = await db.getMediaUsage(m.url);
        return {
          ...m,
          isUsed: usage.isUsed,
          usageCount: usage.references.length,
          references: usage.references,
        };
      })
    );

    return NextResponse.json({
      success: true,
      media: mediaWithUsage,
      total: mediaWithUsage.length,
    });
  } catch (error) {
    console.error('Fetch media list error:', error);
    return NextResponse.json({ error: 'Failed to retrieve media library.' }, { status: 500 });
  }
}
