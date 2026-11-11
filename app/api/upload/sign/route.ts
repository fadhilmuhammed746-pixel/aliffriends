import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase';

// Disallowed dangerous extensions
const DISALLOWED_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.php3', '.php4', '.php5',
  '.phps', '.cgi', '.pl', '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm',
  '.shtml', '.hta', '.vbs', '.vbe', '.jar', '.msi', '.com', '.scr', '.dll',
  '.apk', '.bin', '.reg', '.wsf', '.asp', '.aspx', '.jsp',
]);

// Allowed extensions mapping to categories
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

// Canonical MIME type lookup by file extension to ensure Supabase Storage compatibility
const EXTENSION_MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mkv': 'video/webm',
  '.pdf': 'application/pdf',
};

// Maximum permitted upload limit (50 MB - Supabase project plan limit)
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator credentials required for upload authorization.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { filename, fileType, fileSize, section, contentId } = body;

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required for upload authorization.' }, { status: 400 });
    }

    const ext = path.extname(filename).toLowerCase();

    // 2. Security validation: Disallowed extension
    if (!ext || DISALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Executable or script files (${ext || 'none'}) are strictly prohibited.` },
        { status: 400 }
      );
    }

    // 3. Security validation: Allowed extensions
    const category = ALLOWED_EXTENSIONS[ext];
    if (!category) {
      return NextResponse.json(
        {
          error: `Unsupported file format '${ext}'. Allowed: Images (JPG, PNG, WEBP, SVG, GIF), Videos (MP4, WEBM, MOV), Documents (PDF).`,
        },
        { status: 400 }
      );
    }

    // 4. File size check (up to 50 MB Supabase plan limit)
    if (fileSize && typeof fileSize === 'number' && fileSize > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${(fileSize / (1024 * 1024)).toFixed(1)} MB) exceeds Supabase Storage limit of 50 MB. For large files up to 1 GB, use Firebase Cloud Storage.`,
        },
        { status: 400 }
      );
    }

    // 5. Safe unique file naming
    const rawBase = path.basename(filename, ext).toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40) || 'asset';
    const randomHash = crypto.randomBytes(4).toString('hex');
    const uniqueFileName = `${Date.now()}_${rawBase}_${randomHash}${ext}`;

    const isFinance = section === 'finance' || section === 'receipts';
    const bucketName = isFinance ? 'af12-finance-receipts' : 'af12-media';

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Cloud storage is not configured. Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.' },
        { status: 500 }
      );
    }

    // 6. Generate time-limited signed upload URL & token directly from Supabase Storage
    const { data: signData, error: signError } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(uniqueFileName, { upsert: false });

    if (signError) {
      console.error('Create signed upload URL error:', signError);
      return NextResponse.json(
        { error: `Failed to create signed upload URL: ${signError.message}` },
        { status: 500 }
      );
    }

    // 7. Compute URLs
    const { data: pubData } = supabase.storage.from(bucketName).getPublicUrl(uniqueFileName);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    
    // Direct storage hostname for TUS resumable uploads (recommended by Supabase)
    let directStorageEndpoint = `${supabaseUrl}/storage/v1/upload/resumable`;
    try {
      const parsedUrl = new URL(supabaseUrl);
      const projectRef = parsedUrl.hostname.split('.')[0];
      if (projectRef) {
        directStorageEndpoint = `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;
      }
    } catch {
      // Keep standard endpoint fallback
    }

    const canonicalMimeType = EXTENSION_MIME_MAP[ext] || (fileType && fileType !== 'application/octet-stream' ? fileType : (category === 'pdf' ? 'application/pdf' : 'application/octet-stream'));

    return NextResponse.json({
      success: true,
      canDirectUpload: true,
      bucket: bucketName,
      path: uniqueFileName,
      token: signData.token,
      signedUrl: signData.signedUrl,
      publicUrl: isFinance ? null : pubData.publicUrl,
      directStorageEndpoint,
      isFinance,
      category,
      canonicalMimeType,
      maxSizeMB: 50,
    });
  } catch (error: any) {
    console.error('Sign upload authorization error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal error authorizing file upload.' },
      { status: 500 }
    );
  }
}
