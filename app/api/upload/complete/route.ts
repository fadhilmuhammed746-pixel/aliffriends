import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      filename,
      originalName,
      url,
      mimeType,
      size,
      category,
      section,
      contentId,
      pageCount,
    } = body;

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required.' }, { status: 400 });
    }

    const isFinance = section === 'finance' || section === 'receipts';
    const bucketName = isFinance ? 'af12-finance-receipts' : 'af12-media';

    let finalUrl = url;

    // For private finance receipts, generate signed URL valid for 24 hours
    if (isFinance) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data: signData } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(filename, 60 * 60 * 24);
        finalUrl = signData?.signedUrl || `/api/finance/receipt?file=${filename}`;
      } else {
        finalUrl = `/api/finance/receipt?file=${filename}`;
      }
    }

    // 2. Record media asset in PostgreSQL media_assets table
    const mediaRecord = await db.createMedia({
      filename,
      originalName: originalName || filename,
      url: finalUrl,
      mimeType: mimeType || (category === 'pdf' ? 'application/pdf' : 'application/octet-stream'),
      size: typeof size === 'number' ? size : 0,
      category: category || 'other',
      section: section || 'general',
      contentId: contentId || undefined,
      uploadedBy: session.username || 'admin',
      storageLocation: (body.storageLocation === 'firebase' ? 'firebase' : 'supabase') as 'supabase' | 'firebase',
    });

    return NextResponse.json({
      success: true,
      url: finalUrl,
      media: mediaRecord,
      pageCount: pageCount || undefined,
      message: 'File metadata recorded successfully.',
    });
  } catch (error: any) {
    console.error('Record upload completion error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to record upload metadata in database.' },
      { status: 500 }
    );
  }
}
