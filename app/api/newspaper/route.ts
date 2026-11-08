import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const category = searchParams.get('category');
  const search = searchParams.get('search')?.toLowerCase();

  let articles = await db.getArticles(!all);

  if (category) {
    articles = articles.filter(
      (a) => a.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(search) ||
        a.content.toLowerCase().includes(search) ||
        a.subtitle?.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, coverImage, content, author } = body;

    if (!title || !category || !coverImage || !content) {
      return NextResponse.json(
        { error: 'Required fields: title, category, coverImage, content' },
        { status: 400 }
      );
    }

    // Auto slug from title
    const slug =
      body.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newArticle = await db.createArticle({
      title,
      slug,
      subtitle: body.subtitle || '',
      category,
      headlineStatus: Boolean(body.headlineStatus),
      breakingStatus: Boolean(body.breakingStatus),
      coverImage,
      content,
      author: author || 'Editorial Desk',
      authorRole: body.authorRole || 'Class Correspondent',
      publishedAt: body.publishedAt || new Date().toISOString(),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      galleryImages: body.galleryImages || [],
      videoUrl: body.videoUrl || undefined,
      pdfUrl: body.pdfUrl || undefined,
      pdfTitle: body.pdfTitle || undefined,
      relatedTags: body.relatedTags || [],
    });

    return NextResponse.json({ success: true, article: newArticle });
  } catch (err) {
    console.error('Create article error:', err);
    return NextResponse.json({ error: 'Failed to create article.' }, { status: 500 });
  }
}

