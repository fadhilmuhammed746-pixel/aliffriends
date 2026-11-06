import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Limit size to 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit (50MB).' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '';
    const safeBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueFileName = `${Date.now()}-${safeBaseName}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;

    // Extract page count if PDF
    let detectedPageCount: number | undefined = undefined;
    if (file.type.includes('pdf') || ext.toLowerCase() === '.pdf') {
      try {
        const raw = buffer.toString('binary');
        const countMatch = raw.match(/\/Count\s+(\d+)/);
        if (countMatch) {
          detectedPageCount = parseInt(countMatch[1], 10);
        } else {
          const pageMatches = raw.match(/\/Type\s*\/Page\b/g);
          detectedPageCount = pageMatches ? pageMatches.length : 1;
        }
      } catch (e) {
        console.warn('Page count extraction note:', e);
      }
    }

    // Record in media table
    const mediaRecord = db.createMedia({
      filename: uniqueFileName,
      originalName: file.name,
      url: fileUrl,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      category: file.type.includes('pdf')
        ? 'pdf'
        : file.type.includes('video')
        ? 'video'
        : 'image',
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      pageCount: detectedPageCount,
      media: mediaRecord,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'File upload failed.' }, { status: 500 });
  }
}

