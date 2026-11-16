import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 });
    }

    // Security check: Only allow downloading from Supabase storage or same-origin
    const allowedHosts = [
      'rdcztjtcticvybauejhk.supabase.co',
      'supabase.co',
      'aliffriends.vercel.app',
      'localhost',
    ];

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(fileUrl, req.url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
    }

    const isHostAllowed = allowedHosts.some(
      (host) => parsedUrl.hostname.endsWith(host) || parsedUrl.hostname === host
    );

    if (!isHostAllowed && !fileUrl.startsWith('/')) {
      return NextResponse.json({ error: 'Host not allowed for download proxy.' }, { status: 403 });
    }

    // Direct HTTP 307 redirect eliminates Vercel 4.5MB function payload limit
    return NextResponse.redirect(fileUrl, 307);
  } catch (error: any) {
    console.error('[Download Proxy Error]', error);
    return NextResponse.json({ error: 'Failed to process download request.' }, { status: 500 });
  }
}
