import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliffriends12.org';
  const articles = db.getArticles(true);
  const magazines = db.getMagazines(true);
  const programs = db.getPrograms(true);
  const videos = db.getVideos(true);
  const albums = db.getAlbums(true);

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
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
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/newspaper/${art.slug}`,
    lastModified: new Date(art.updatedAt || art.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const magazineRoutes: MetadataRoute.Sitemap = magazines.map((mag) => ({
    url: `${baseUrl}/magazine/${mag.id}`,
    lastModified: new Date(mag.updatedAt || mag.createdAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes, ...magazineRoutes];
}
