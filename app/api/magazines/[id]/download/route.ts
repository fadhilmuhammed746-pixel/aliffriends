import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const magazine = await db.getMagazineById(id);

    if (!magazine) {
      return NextResponse.json(
        { error: 'Magazine publication not found.' },
        { status: 404 }
      );
    }

    let pdfUrl = magazine.pdfUrl;

    // Special fallback for Khavarikhul Adaath if not set or pointing to legacy path
    if (
      !pdfUrl ||
      pdfUrl.includes('sample-magazine') ||
      pdfUrl.includes('khavarikhul-adaath-edition-1.pdf')
    ) {
      if (magazine.id === 'mag_1794137111511' || magazine.title?.toLowerCase().includes('khavarikhul')) {
        pdfUrl = 'https://rdcztjtcticvybauejhk.supabase.co/storage/v1/object/public/af12-media/magazines/khavarikhul_adaath_official.pdf';
      }
    }

    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'No downloadable PDF publication associated with this edition.' },
        { status: 404 }
      );
    }

    // Remote PDF: Redirect directly with HTTP 307 to avoid Vercel 4.5MB serverless payload limit
    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
      return NextResponse.redirect(pdfUrl, 307);
    }

    // Local static PDF: If present in public directory, redirect to static asset
    const cleanRelativePath = pdfUrl.startsWith('/') ? pdfUrl.slice(1) : pdfUrl;
    const localFile = path.join(process.cwd(), 'public', cleanRelativePath);

    if (fs.existsSync(localFile)) {
      return NextResponse.redirect(new URL(pdfUrl, req.url), 307);
    }

    // Fallback: Check public/magazines/khavarikhul-adaath-official.pdf
    const defaultLocalPdf = path.join(process.cwd(), 'public', 'magazines', 'khavarikhul-adaath-official.pdf');
    if (fs.existsSync(defaultLocalPdf)) {
      return NextResponse.redirect(new URL('/magazines/khavarikhul-adaath-official.pdf', req.url), 307);
    }

    // Remote official storage fallback
    return NextResponse.redirect(
      'https://rdcztjtcticvybauejhk.supabase.co/storage/v1/object/public/af12-media/magazines/khavarikhul_adaath_official.pdf',
      307
    );
  } catch (error: any) {
    console.error('[Download Error] Unexpected error serving magazine PDF:', error);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred while preparing the PDF download.' },
      { status: 500 }
    );
  }
}
