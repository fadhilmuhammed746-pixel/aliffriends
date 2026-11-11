import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getAdminStorage } from '@/lib/firebase/admin';

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
    let finalUrl = url;

    // For private finance receipts, generate signed URL if needed
    if (isFinance) {
      const adminStorage = getAdminStorage();
      if (adminStorage) {
        try {
          const bucket = adminStorage.bucket();
          const fileRef = bucket.file(`finance-receipts/${filename}`);
          const [signedUrl] = await fileRef.getSignedUrl({
            action: 'read',
            expires: Date.now() + 24 * 60 * 60 * 1000,
          });
          finalUrl = signedUrl;
        } catch {
          finalUrl = `/api/finance/receipt?file=${filename}`;
        }
      } else {
        finalUrl = `/api/finance/receipt?file=${filename}`;
      }
    }

    // 2. Record media asset in Firebase / local database
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
      storageLocation: 'firebase',
    });

    return NextResponse.json({
      success: true,
      url: finalUrl,
      media: mediaRecord,
      pageCount: pageCount || undefined,
      message: 'Upload completed and cataloged in Firebase Cloud Storage.',
    });
  } catch (error: any) {
    console.error('Upload complete error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to complete upload registration.' },
      { status: 500 }
    );
  }
}
