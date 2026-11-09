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

    if (!magazine || !magazine.pdfUrl) {
      return NextResponse.json(
        { error: 'Magazine or PDF publication not found.' },
        { status: 404 }
      );
    }

    let pdfBuffer: Buffer | null = null;
    const pdfUrl = magazine.pdfUrl;

    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
      // Remote PDF from Supabase Storage, Firebase Storage, or CDN
      const response = await fetch(pdfUrl, {
        headers: {
          'Accept': 'application/pdf,*/*',
          'User-Agent': 'ALIF-FRIENDS-12-Magazine-Downloader/1.0',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`[Download Error] Remote fetch failed with HTTP ${response.status} for ${pdfUrl}`);
        return NextResponse.json(
          { error: `Failed to retrieve magazine PDF from storage (HTTP ${response.status}).` },
          { status: 502 }
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } else {
      // Local file fallback
      const cleanRelativePath = pdfUrl.startsWith('/') ? pdfUrl.slice(1) : pdfUrl;
      const candidates = [
        path.join(process.cwd(), 'public', cleanRelativePath),
        path.join(process.cwd(), cleanRelativePath),
        path.join(process.cwd(), 'public', 'sample-magazine-af12.pdf'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          pdfBuffer = await fs.promises.readFile(candidate);
          break;
        }
      }
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return NextResponse.json(
        { error: 'Magazine PDF content is empty or unavailable.' },
        { status: 404 }
      );
    }

    // Verify valid PDF signature (%PDF-)
    const signature = pdfBuffer.slice(0, 5).toString('ascii');
    if (!signature.startsWith('%PDF-')) {
      console.error(`[Download Error] Invalid PDF header detected: "${signature}". Received non-PDF data.`);
      return NextResponse.json(
        { error: 'Invalid document signature. The retrieved file is not a valid PDF publication.' },
        { status: 502 }
      );
    }

    // Generate safe, descriptive filename
    const safeBaseName = (magazine.title || 'alif-friends-12-magazine')
      .replace(/[<>:"/\\|?*]+/g, '')
      .replace(/\s+/g, '_')
      .trim();
    const finalFilename = `${safeBaseName}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${finalFilename}"; filename*=UTF-8''${encodeURIComponent(finalFilename)}`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('[Download Error] Unexpected error serving magazine PDF:', error);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred while preparing the PDF download.' },
      { status: 500 }
    );
  }
}

