import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Pass API routes directly without Supabase SSR session interception
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - PWA files (manifest.json, manifest.webmanifest, sw.js)
     * - static asset files (svg, png, jpg, jpeg, gif, webp, mp4, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest\\.json|manifest\\.webmanifest|sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|pdf)$).*)',
  ],
};

