import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Image as ImageIcon, Camera, Globe, Lock, ArrowRight } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-gold/20 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest mb-4">
          <Camera className="w-3.5 h-3.5" />
          <span>Visual Heritage Archive</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide mb-4">
          Class Photo Gallery
        </h1>
        <p className="text-sm text-ivory/70 leading-relaxed font-sans">
          Curated visual albums chronicling our shared milestones, expedition treks, sports championships, and candid moments of joy.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
        <Link
          href="/gallery"
          className={`px-4 py-2 rounded-xl uppercase tracking-wider font-serif font-bold transition-colors ${
            !category ? 'bg-gold text-navy' : 'bg-charcoal text-ivory hover:text-gold border border-gold/20'
          }`}
        >
          All Collections
        </Link>
        {albumCategories.map((cat) => (
          <Link
            key={cat}
            href={`/gallery?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-xl uppercase tracking-wider font-serif font-medium transition-colors ${
              category?.toLowerCase() === cat.toLowerCase()
                ? 'bg-gold text-navy font-bold'
                : 'bg-charcoal text-ivory/80 hover:text-gold border border-gold/20'
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
            className="bg-charcoal border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
          >
            <Link href={`/gallery/${alb.id}`} className="block relative aspect-[4/3] bg-navy-950 overflow-hidden">
              <img
                src={alb.coverImage}
                alt={alb.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-navy/90 text-gold border border-gold/30">
                  {alb.category}
                </span>
                {alb.isRestricted && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Restricted
                  </span>
                )}
              </div>
              <span className="absolute bottom-3 right-3 text-[10px] font-mono bg-navy/90 text-ivory px-2 py-0.5 rounded border border-gold/30">
                {alb.photos?.length || 0} Photographs
              </span>
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-ivory group-hover:text-gold transition-colors mb-2">
                  <Link href={`/gallery/${alb.id}`}>{alb.title}</Link>
                </h2>
                <p className="text-xs text-muted-light line-clamp-2 leading-relaxed">
                  {alb.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gold/15 mt-4">
                <Link
                  href={`/gallery/${alb.id}`}
                  className="w-full py-2.5 bg-navy hover:bg-navy-light text-gold hover:text-gold-light border border-gold/30 hover:border-gold text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5" />
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
