import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { AlbumViewer } from '@/components/gallery/AlbumViewer';
import { ArrowLeft, Lock, Globe } from 'lucide-react';

export const revalidate = 0;

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = db.getAlbumById(id);

  if (!album || !album.isPublished) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-canvas text-ink">
      {/* Back navigation */}
      <div>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-forest hover:text-coral transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-coral" />
          <span>Back to Photo Gallery</span>
        </Link>
      </div>

      {/* Album Masthead */}
      <div className="space-y-3 border-b border-editorial-border pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-forest-50 text-forest border border-forest-100 font-bold">
            {album.category}
          </span>
          {album.isRestricted ? (
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-coral text-white font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Restricted Archive
            </span>
          ) : (
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-forest text-white font-bold flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Public Archive
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
          {album.title}
        </h1>

        {album.description && (
          <p className="text-sm sm:text-base text-ink-light font-sans leading-relaxed max-w-3xl">
            {album.description}
          </p>
        )}
      </div>

      {/* Album Viewer with Lightbox */}
      <AlbumViewer album={album} />
    </div>
  );
}
