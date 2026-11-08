import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, fileType, section } = await req.json();
    if (!filename || !fileType) {
      return NextResponse.json({ error: 'Filename and fileType are required' }, { status: 400 });
    }

    const ext = path.extname(filename).toLowerCase();
    const rawBase = path.basename(filename, ext).toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40) || 'asset';
    const randomHash = crypto.randomBytes(4).toString('hex');
    const uniqueFileName = `${Date.now()}_${rawBase}_${randomHash}${ext}`;

    const isFinance = section === 'finance' || section === 'receipts';
    const bucketName = isFinance ? 'af12-finance-receipts' : 'af12-media';

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        canDirectUpload: false,
        message: 'Supabase storage not configured; please use standard /api/upload',
      });
    }

    // Create signed upload URL
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(uniqueFileName);

    if (error) {
      throw error;
    }

    const { data: pubData } = supabase.storage.from(bucketName).getPublicUrl(uniqueFileName);

    return NextResponse.json({
      canDirectUpload: true,
      bucket: bucketName,
      path: uniqueFileName,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl: isFinance ? null : pubData.publicUrl,
    });
  } catch (error: any) {
    console.error('Sign upload error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to sign upload URL' }, { status: 500 });
  }
}
