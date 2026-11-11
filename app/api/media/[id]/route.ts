import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { getAdminStorage } from '@/lib/firebase/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    const media = await db.getMediaById(id);
    if (!media) {
      return NextResponse.json({ error: 'Media asset not found.' }, { status: 404 });
    }

    const usage = await db.getMediaUsage(media.url);
    return NextResponse.json({
      success: true,
      media: {
        ...media,
        isUsed: usage.isUsed,
        usageCount: usage.references.length,
        references: usage.references,
      },
    });
  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json({ error: 'Failed to fetch media record.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    const media = await db.getMediaById(id);
    if (!media) {
      return NextResponse.json({ error: 'Media asset not found.' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    // Check usage
    const usage = await db.getMediaUsage(media.url);
    if (usage.isUsed && !force) {
      return NextResponse.json(
        {
          error: 'This file cannot be deleted because it is currently linked to one or more publication items.',
          inUse: true,
          references: usage.references,
          message: 'Pass force=true if you explicitly wish to override and delete this asset.',
        },
        { status: 409 }
      );
    }

    // Attempt to remove physical file from Firebase Cloud Storage
    const isCloudStorage = media.storageLocation === 'firebase' || media.url.includes('firebasestorage') || media.url.includes('storage.googleapis.com');
    if (isCloudStorage) {
      const adminStorage = getAdminStorage();
      if (adminStorage) {
        try {
          const bucket = adminStorage.bucket();
          const storagePath = (media.section === 'finance' || media.section === 'receipts')
            ? `finance-receipts/${media.filename}`
            : `media/${media.filename}`;
          await bucket.file(storagePath).delete({ ignoreNotFound: true });
        } catch (err) {
          console.warn('Firebase Storage file deletion warning:', err);
        }
      }
    } else if (media.url && media.url.startsWith('/uploads/')) {
      const fileName = media.url.replace('/uploads/', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('Physical file deletion warning:', err);
        }
      }
    }

    // Delete record from database
    await db.deleteMedia(id);

    return NextResponse.json({
      success: true,
      message: 'Media asset deleted successfully.',
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Failed to delete media asset.' }, { status: 500 });
  }
}
