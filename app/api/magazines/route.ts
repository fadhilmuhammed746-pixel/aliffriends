import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const magazines = db.getMagazines(!all);
  return NextResponse.json({ magazines });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, editionNumber, publicationDate, description, coverImage, pdfUrl, author, editor } = body;

    if (!title || !editionNumber || !publicationDate || !coverImage || !pdfUrl) {
      return NextResponse.json(
        { error: 'Required fields: title, editionNumber, publicationDate, coverImage, pdfUrl' },
        { status: 400 }
      );
    }

    const newMag = db.createMagazine({
      title,
      editionNumber,
      publicationDate,
      description: description || '',
      coverImage,
      pdfUrl,
      author: author || 'Editorial Board',
      editor: editor || 'Alif Friends 12 Editors',
      pageCount: body.pageCount || 0,
      fileSize: body.fileSize || 'N/A',
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      tags: body.tags || [],
    });

    return NextResponse.json({ success: true, magazine: newMag });
  } catch (err) {
    console.error('Create magazine error:', err);
    return NextResponse.json({ error: 'Failed to create magazine.' }, { status: 500 });
  }
}

