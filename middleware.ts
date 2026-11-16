import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml & robots.txt (search engine discovery)
     * - PWA files (manifest.json, manifest.webmanifest, sw.js)
     * - static asset files (svg, png, jpg, jpeg, gif, webp, mp4, webm, pdf, xml, txt, html)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|manifest\\.json|manifest\\.webmanifest|sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|pdf|xml|txt|html)$).*)',
  ],
};

