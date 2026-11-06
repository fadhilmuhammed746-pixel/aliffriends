import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Camera, Lock } from 'lucide-react';

export const revalidate = 0;

export default async function GalleryArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let albums = db.getAlbums(true);

  if (category) {
    albums = albums.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }

  const albumCategories = ['Special Moment', 'Event', 'Trip', 'Celebration', 'Competition'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-canvas text-ink">
      {/* Header */}
      <div className="border-b border-editorial-border pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
          <Camera className="w-3.5 h-3.5 text-coral" />
          <span>Visual Heritage Archive</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight">
          Class Photo Gallery
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed font-sans max-w-2xl mx-auto">
          Curated visual albums chronicling our shared milestones, expedition treks, sports championships, and candid moments of joy.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
        <Link
          href="/gallery"
          className={`px-4 py-2 rounded-xl uppercase tracking-wider font-serif font-bold transition-colors ${
            !category ? 'bg-forest text-white' : 'bg-white text-ink hover:text-forest border border-editorial-border'
          }`}
        >
          All Collections
        </Link>
        {albumCategories.map((cat) => (
          <Link
            key={cat}
            href={`/gallery?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-xl uppercase tracking-wider font-serif font-semibold transition-colors ${
              category?.toLowerCase() === cat.toLowerCase()
                ? 'bg-forest text-white'
                : 'bg-white text-ink-muted hover:text-forest border border-editorial-border'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((alb) => (
          <div
            key={alb.id}
            className="bg-white border border-editorial-border hover:border-forest/40 rounded-2xl overflow-hidden shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
          >
            <Link href={`/gallery/${alb.id}`} className="block relative aspect-[4/3] bg-canvas overflow-hidden">
              <img
                src={alb.coverImage}
                alt={alb.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-forest text-white font-bold">
                  {alb.category}
                </span>
                {alb.isRestricted && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral text-white font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Restricted
                  </span>
                )}
              </div>
              <span className="absolute bottom-3 right-3 text-[10px] font-mono bg-forest/90 text-white px-2 py-0.5 rounded border border-forest-700">
                {alb.photos?.length || 0} Photographs
              </span>
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2">
                  <Link href={`/gallery/${alb.id}`}>{alb.title}</Link>
                </h2>
                <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                  {alb.description}
                </p>
              </div>

              <div className="pt-4 border-t border-editorial-border mt-4">
                <Link
                  href={`/gallery/${alb.id}`}
                  className="w-full py-2.5 bg-canvas hover:bg-forest text-forest hover:text-white border border-editorial-border hover:border-forest text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5 text-coral" />
                  <span>Launch Album Viewer</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
