import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');
    const requestedFilename = searchParams.get('filename') || 'downloaded-file';

    if (!fileUrl) {
      return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 });
    }

    // Security check: Only allow downloading from Supabase storage or same-origin
    const allowedHosts = [
      'rdcztjtcticvybauejhk.supabase.co',
      'supabase.co',
    ];

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(fileUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
    }

    const isHostAllowed = allowedHosts.some(host => parsedUrl.hostname.endsWith(host) || parsedUrl.hostname === host);
    if (!isHostAllowed && !fileUrl.startsWith('/')) {
      return NextResponse.json({ error: 'Host not allowed for download proxy.' }, { status: 403 });
    }

    const response = await fetch(fileUrl, {
      headers: {
        'Accept': '*/*',
        'User-Agent': 'ALIF-FRIENDS-12-Downloader/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Remote resource returned HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFilename = requestedFilename
      .replace(/[<>:"/\\|?*]+/g, '')
      .replace(/\s+/g, '_')
      .trim();

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('[Download Proxy Error]', error);
    return NextResponse.json({ error: 'Failed to stream download.' }, { status: 500 });
  }
}

