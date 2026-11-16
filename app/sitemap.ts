import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

const OFFICIAL_BASE_URL = 'https://aliffriends.vercel.app';

function parseValidDate(dateStr?: string | null): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = OFFICIAL_BASE_URL;

  const [articles, magazines, programs, videos, albums] = await Promise.all([
    db.getArticles(true),
    db.getMagazines(true),
    db.getPrograms(true),
    db.getVideos(true),
    db.getAlbums(true),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/magazine',
    '/newspaper',
    '/programs',
    '/videos',
    '/gallery',
    '/members',
    '/achievements',
    '/announcements',
    '/about',
    '/contact',
  ].map((route) => ({
    url: route === '/' ? `${baseUrl}/` : `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '/' ? 1.0 : 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/newspaper/${art.slug}`,
    lastModified: parseValidDate(art.updatedAt || art.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const magazineRoutes: MetadataRoute.Sitemap = magazines.map((mag) => ({
    url: `${baseUrl}/magazine/${mag.id}`,
    lastModified: parseValidDate(mag.updatedAt || mag.createdAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const programRoutes: MetadataRoute.Sitemap = programs.map((prog) => ({
    url: `${baseUrl}/programs/${prog.id}`,
    lastModified: parseValidDate(prog.updatedAt || prog.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const videoRoutes: MetadataRoute.Sitemap = videos.map((vid) => ({
    url: `${baseUrl}/videos/${vid.id}`,
    lastModified: parseValidDate(vid.updatedAt || vid.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const albumRoutes: MetadataRoute.Sitemap = albums.map((alb) => ({
    url: `${baseUrl}/gallery/${alb.id}`,
    lastModified: parseValidDate(alb.updatedAt || alb.createdAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const allRoutes = [
    ...staticRoutes,
    ...articleRoutes,
    ...magazineRoutes,
    ...programRoutes,
    ...videoRoutes,
    ...albumRoutes,
  ];

  // Deduplicate URLs to ensure uniqueness
  const seenUrls = new Set<string>();
  const uniqueRoutes: MetadataRoute.Sitemap = [];

  for (const entry of allRoutes) {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      uniqueRoutes.push(entry);
    }
  }

  return uniqueRoutes;
}
