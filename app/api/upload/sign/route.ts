import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { getAdminStorage } from '@/lib/firebase/admin';

// Disallowed dangerous extensions
const DISALLOWED_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.php3', '.php4', '.php5',
  '.phps', '.cgi', '.pl', '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm',
  '.shtml', '.hta', '.vbs', '.vbe', '.jar', '.msi', '.com', '.scr', '.dll',
  '.apk', '.bin', '.reg', '.wsf', '.asp', '.aspx', '.jsp',
]);

// Allowed extensions mapping to categories
const ALLOWED_EXTENSIONS: Record<string, 'image' | 'video' | 'pdf'> = {
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.webp': 'image',
  '.gif': 'image',
  '.svg': 'image',
  '.mp4': 'video',
  '.webm': 'video',
  '.mov': 'video',
  '.mkv': 'video',
  '.pdf': 'pdf',
};

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1024; // 1 GB (Firebase Cloud Storage)

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator credentials required for upload authorization.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { filename, fileType, fileSize, section } = body;

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required for upload authorization.' }, { status: 400 });
    }

    const ext = path.extname(filename).toLowerCase();

    if (!ext || DISALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Executable or script files (${ext || 'none'}) are strictly prohibited.` },
        { status: 400 }
      );
    }

    const category = ALLOWED_EXTENSIONS[ext];
    if (!category) {
      return NextResponse.json(
        { error: `Unsupported file format '${ext}'. Allowed: Images, Videos, PDFs.` },
        { status: 400 }
      );
    }

    if (fileSize && typeof fileSize === 'number' && fileSize > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds 1 GB limit.` },
        { status: 400 }
      );
    }

    const rawBase = path.basename(filename, ext).toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40) || 'asset';
    const randomHash = crypto.randomBytes(4).toString('hex');
    const uniqueFileName = `${Date.now()}_${rawBase}_${randomHash}${ext}`;
    const isFinance = section === 'finance' || section === 'receipts';

    const adminStorage = getAdminStorage();
    if (adminStorage) {
      try {
        const bucket = adminStorage.bucket();
        const storagePath = isFinance ? `finance-receipts/${uniqueFileName}` : `media/${uniqueFileName}`;
        const fileRef = bucket.file(storagePath);

        const [signedUrl] = await fileRef.getSignedUrl({
          action: 'write',
          expires: Date.now() + 60 * 60 * 1000,
          contentType: fileType || (category === 'pdf' ? 'application/pdf' : 'application/octet-stream'),
        });

        return NextResponse.json({
          success: true,
          provider: 'firebase',
          path: storagePath,
          filename: uniqueFileName,
          signedUrl,
          publicUrl: isFinance ? null : `https://storage.googleapis.com/${bucket.name}/${storagePath}`,
          maxSizeMB: 1024,
        });
      } catch (err) {
        console.warn('Firebase Admin Storage sign URL notice:', err);
      }
    }

    return NextResponse.json({
      success: true,
      provider: 'firebase-direct',
      filename: uniqueFileName,
      message: 'Direct Firebase Cloud Storage uploads supported via uploadBytesResumable (up to 1 GB).',
      maxSizeMB: 1024,
    });
  } catch (error: any) {
    console.error('Sign upload authorization error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal error authorizing file upload.' },
      { status: 500 }
    );
  }
}
