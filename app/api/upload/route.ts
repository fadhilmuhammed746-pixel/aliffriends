import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Security: Disallowed dangerous executable extensions
const DISALLOWED_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.php3', '.php4', '.php5',
  '.phps', '.cgi', '.pl', '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm',
  '.shtml', '.hta', '.vbs', '.vbe', '.jar', '.msi', '.com', '.scr', '.dll',
  '.apk', '.bin', '.reg', '.wsf', '.asp', '.aspx', '.jsp',
]);

// Allowed extension mapping to categories
const ALLOWED_EXTENSIONS: Record<string, 'image' | 'video' | 'pdf'> = {
  // Images
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.webp': 'image',
  '.gif': 'image',
  '.svg': 'image',
  // Videos
  '.mp4': 'video',
  '.webm': 'video',
  '.mov': 'video',
  '.mkv': 'video',
  // Documents
  '.pdf': 'pdf',
};

// Size limits
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_PDF_SIZE = 100 * 1024 * 1024; // 100MB

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator access required for file upload.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const requestedSection = (formData.get('section') as string) || 'general';
    const contentId = (formData.get('contentId') as string) || undefined;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();

    // 1. Check dangerous extension
    if (!ext || DISALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Executable or script files (${ext || 'none'}) are strictly prohibited for system security.` },
        { status: 400 }
      );
    }

    // 2. Validate against allowed extensions
    const category = ALLOWED_EXTENSIONS[ext];
    if (!category) {
      return NextResponse.json(
        {
          error: `Unsupported file format '${ext}'. Allowed: Images (JPG, PNG, WEBP, SVG), Videos (MP4, WEBM, MOV), Documents (PDF).`,
        },
        { status: 400 }
      );
    }

    // 3. Size limit check
    const maxSize = category === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_PDF_SIZE;
    const maxMB = Math.round(maxSize / (1024 * 1024));
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size exceeds the permitted limit for ${category} uploads (${maxMB} MB). Please compress the file before uploading.`,
        },
        { status: 400 }
      );
    }

    // 4. Safe file naming
    const buffer = Buffer.from(await file.arrayBuffer());
    const rawBaseName = path.basename(file.name, ext);
    const safeBaseName =
      rawBaseName
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .slice(0, 40) || 'asset';

    const randomHash = crypto.randomBytes(4).toString('hex');
    const uniqueFileName = `${Date.now()}_${safeBaseName}_${randomHash}${ext}`;

    const supabase = getSupabaseClient();
    let fileUrl = '';
    let storageLocation: 'supabase' | 'local' = 'local';

    if (supabase) {
      // Production Cloud Storage: Supabase Storage
      const isFinance = requestedSection === 'finance' || requestedSection === 'receipts';
      const bucketName = isFinance ? 'af12-finance-receipts' : 'af12-media';

      const mimeType =
        file.type ||
        (category === 'pdf'
          ? 'application/pdf'
          : category === 'video'
          ? 'video/mp4'
          : 'image/jpeg');

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadErr) {
        console.error('Supabase storage upload error:', uploadErr);
        throw new Error(`Cloud storage upload failed: ${uploadErr.message}`);
      }

      if (isFinance) {
        // For private finance receipts, generate signed URL valid for 24 hours
        const { data: signData } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(uniqueFileName, 60 * 60 * 24);
        fileUrl = signData?.signedUrl || `/api/finance/receipt?file=${uniqueFileName}`;
      } else {
        const { data: pubData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uniqueFileName);
        fileUrl = pubData.publicUrl;
      }
      storageLocation = 'supabase';
    } else {
      // Local development fallback
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          {
            error:
              'Cloud storage is not configured. On production / Vercel, NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.',
          },
          { status: 500 }
        );
      }

      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      const filePath = path.join(UPLOAD_DIR, uniqueFileName);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/${uniqueFileName}`;
      storageLocation = 'local';
    }

    // 5. Automatic PDF page count extraction
    let detectedPageCount: number | undefined = undefined;
    if (category === 'pdf') {
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
        console.warn('PDF page count extraction note:', e);
      }
    }

    // 6. Record metadata in database
    const mediaRecord = await db.createMedia({
      filename: uniqueFileName,
      originalName: file.name,
      url: fileUrl,
      mimeType:
        file.type ||
        (category === 'pdf'
          ? 'application/pdf'
          : category === 'video'
          ? 'video/mp4'
          : 'image/jpeg'),
      size: file.size,
      category,
      section: requestedSection,
      contentId,
      uploadedBy: session.username || 'admin',
      storageLocation,
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: uniqueFileName,
      originalName: file.name,
      size: file.size,
      category,
      pageCount: detectedPageCount,
      media: mediaRecord,
      storageLocation,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'File upload processing failed.' },
      { status: 500 }
    );
  }
}
