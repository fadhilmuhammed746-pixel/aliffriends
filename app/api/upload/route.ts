import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getSupabaseAdminClient } from '@/lib/supabase';

// Security: Disallowed dangerous executable extensions
const DISALLOWED_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.php3', '.php4', '.php5',
  '.phps', '.cgi', '.pl', '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm',
  '.shtml', '.hta', '.vbs', '.vbe', '.jar', '.msi', '.com', '.scr', '.dll',
  '.apk', '.bin', '.reg', '.wsf', '.asp', '.aspx', '.jsp',
]);

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

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator access required for file upload.' },
        { status: 401 }
      );
    }

    const contentType = req.headers.get('content-type') || '';

    // If client sends JSON metadata, recommend or route to direct upload
    if (contentType.includes('application/json')) {
      return NextResponse.json({
        message: 'For large files, please use /api/upload/sign to obtain a direct Supabase signed upload URL.',
        signEndpoint: '/api/upload/sign',
        completeEndpoint: '/api/upload/complete',
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const requestedSection = (formData.get('section') as string) || 'general';
    const contentId = (formData.get('contentId') as string) || undefined;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawBaseName = path.basename(file.name, ext);
    const safeBaseName = rawBaseName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40) || 'asset';
    const randomHash = crypto.randomBytes(4).toString('hex');
    const uniqueFileName = `${Date.now()}_${safeBaseName}_${randomHash}${ext}`;

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Cloud storage is not configured. Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.' },
        { status: 500 }
      );
    }

    const isFinance = requestedSection === 'finance' || requestedSection === 'receipts';
    const bucketName = isFinance ? 'af12-finance-receipts' : 'af12-media';

    const mimeType =
      file.type ||
      (category === 'pdf' ? 'application/pdf' : category === 'video' ? 'video/mp4' : 'image/jpeg');

    const { error: uploadErr } = await supabase.storage
      .from(bucketName)
      .upload(uniqueFileName, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadErr) {
      console.error('Supabase storage upload error:', uploadErr);
      throw new Error(`Cloud storage upload failed: ${uploadErr.message}`);
    }

    let fileUrl = '';
    if (isFinance) {
      const { data: signData } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(uniqueFileName, 60 * 60 * 24);
      fileUrl = signData?.signedUrl || `/api/finance/receipt?file=${uniqueFileName}`;
    } else {
      const { data: pubData } = supabase.storage.from(bucketName).getPublicUrl(uniqueFileName);
      fileUrl = pubData.publicUrl;
    }

    const mediaRecord = await db.createMedia({
      filename: uniqueFileName,
      originalName: file.name,
      url: fileUrl,
      mimeType,
      size: file.size,
      category,
      section: requestedSection,
      contentId,
      uploadedBy: session.username || 'admin',
      storageLocation: 'supabase',
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      media: mediaRecord,
      message: 'File uploaded and cataloged in persistent cloud storage.',
    });
  } catch (error: any) {
    console.error('Upload processing error:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload processing failed on server.' },
      { status: 500 }
    );
  }
}
