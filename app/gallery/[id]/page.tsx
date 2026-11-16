import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { AlbumViewer } from '@/components/gallery/AlbumViewer';
import { ArrowLeft, Lock, Globe } from 'lucide-react';
import { Container, Badge } from '@/components/ui';

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const album = await db.getAlbumById(id);
  if (!album) return {};

  const cleanDesc = (album.description || `${album.title} - ALIF FRIENDS 12 Photo Gallery`).replace(/<[^>]*>/g, '').slice(0, 160);

  return {
    title: album.title,
    description: cleanDesc,
    alternates: {
      canonical: `/gallery/${album.id}`,
    },
    openGraph: {
      title: `${album.title} | ALIF FRIENDS 12`,
      description: cleanDesc,
      url: `https://aliffriends.vercel.app/gallery/${album.id}`,
    },
  };
}

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await db.getAlbumById(id);

  if (!album || !album.isPublished) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16 space-y-8 bg-canvas text-ink">
      <Container size="narrow">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-tag text-forest hover:text-coral transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-coral" />
            <span>Back to Photo Gallery</span>
          </Link>
        </div>

        {/* Album Masthead */}
        <div className="space-y-4 border-b border-editorial-border pb-6 mb-8">
          <div className="flex items-center gap-2">
            <Badge variant="forest">{album.category}</Badge>
            {album.isRestricted ? (
              <Badge variant="urgent" icon={<Lock className="w-3 h-3" />}>
                Restricted Archive
              </Badge>
            ) : (
              <Badge variant="muted" icon={<Globe className="w-3 h-3" />}>
                Public Archive
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-forest tracking-tight leading-tight">
            {album.title}
          </h1>

          {album.description && (
            <p className="text-sm sm:text-base text-ink-light font-sans leading-relaxed max-w-3xl">
              {album.description}
            </p>
          )}

          <div className="text-xs font-mono text-ink-muted">
            Documented {album.eventDate ? `on ${album.eventDate}` : ''} • {album.photos.length} Photographs
          </div>
        </div>

        {/* Album Viewer with Fullscreen Lightbox */}
        <AlbumViewer album={album} />
      </Container>
    </div>
  );
}
