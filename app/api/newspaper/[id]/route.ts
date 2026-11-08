import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await db.getArticleBySlugOrId(id);
  if (!article) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  }

  // Increment view count
  await db.incrementArticleView(article.id);

  return NextResponse.json({ article });
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
  const updated = await db.updateArticle(id, body);
  if (!updated) {
    return NextResponse.json({ error: 'Article not found or update failed.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, article: updated });
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
  const deleted = await db.deleteArticle(id);
  return NextResponse.json({ success: deleted });
}

