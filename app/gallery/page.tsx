import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Camera, Lock } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';

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
    <div className="py-16 sm:py-20 space-y-12 bg-canvas text-ink">
      <Container>
        {/* Header */}
        <SectionHeader
          centered={true}
          eyebrow="Visual Heritage Archive"
          eyebrowColor="coral"
          title="Class Photo Gallery"
          subtitle="Curated photographic albums chronicling our shared milestones, expedition treks, sports championships, and candid moments of joy."
        />

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs my-8">
          <Link
            href="/gallery"
            className={`px-4 py-2 rounded-full uppercase tracking-tag font-serif text-[11px] font-bold transition-colors select-none ${
              !category ? 'bg-forest text-white' : 'bg-white text-ink-muted hover:text-forest border border-editorial-border shadow-subtle'
            }`}
          >
            All Collections
          </Link>
          {albumCategories.map((cat) => (
            <Link
              key={cat}
              href={`/gallery?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full uppercase tracking-tag font-serif text-[11px] font-semibold transition-colors select-none ${
                category?.toLowerCase() === cat.toLowerCase()
                  ? 'bg-forest text-white'
                  : 'bg-white text-ink-muted hover:text-forest border border-editorial-border shadow-subtle'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {albums.length === 0 ? (
          <EmptyState
            icon={<Camera className="w-6 h-6" />}
            title="No Photo Albums Found"
            description="No photo collections matched your filter. Try choosing another category."
            actionHref="/gallery"
            actionLabel="Reset Gallery Filter"
          />
        ) : (
          /* Masonry / Grid of Albums with Cards and Image Zoom */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((alb) => (
              <Card
                key={alb.id}
                className="p-0 flex flex-col justify-between group"
                hoverEffect={true}
              >
                <Link href={`/gallery/${alb.id}`} className="block relative aspect-[4/3] bg-canvas overflow-hidden">
                  <img
                    src={alb.coverImage}
                    alt={alb.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="forest">{alb.category}</Badge>
                    {alb.isRestricted && (
                      <Badge variant="urgent" icon={<Lock className="w-3 h-3" />}>
                        Restricted
                      </Badge>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono bg-forest-950/90 text-white px-2.5 py-1 rounded border border-forest-800 font-bold backdrop-blur-sm">
                    {alb.photos?.length || 0} Photographs
                  </span>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2 leading-snug">
                      <Link href={`/gallery/${alb.id}`}>{alb.title}</Link>
                    </h2>
                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed font-sans">
                      {alb.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-editorial-border mt-4 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-ink-muted">
                      {alb.eventDate || new Date(alb.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/gallery/${alb.id}`}
                      className="text-xs font-serif font-bold text-forest hover:text-coral uppercase tracking-tag"
                    >
                      <span>Open Album &rarr;</span>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
