import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { FlipbookReader } from '@/components/magazine/FlipbookReader';
import { ArrowLeft, BookOpen, Download, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function MagazineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const magazine = db.getMagazineById(id);

  if (!magazine || !magazine.isPublished) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 bg-canvas text-ink">
      {/* Back button */}
      <div>
        <Link
          href="/magazine"
          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-forest hover:text-coral transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-coral" />
          <span>Back to Magazine Archive</span>
        </Link>
      </div>

      {/* Magazine Overview Header */}
      <div className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-10 shadow-editorial flex flex-col md:flex-row gap-8 items-start">
        <div className="relative group flex-shrink-0">
          <img
            src={magazine.coverImage}
            alt={magazine.title}
            className="w-40 sm:w-56 aspect-[3/4] object-cover rounded-xl border border-editorial-border shadow-editorial group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-forest/90 text-white font-bold backdrop-blur">
              {magazine.editionNumber}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-forest/10 text-forest border border-forest/20 font-bold">
              {magazine.editionNumber}
            </span>
            <span className="text-xs font-mono text-muted">
              Published: {magazine.publicationDate}
            </span>
            {magazine.isFeatured && (
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-coral text-white font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured Edition
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
            {magazine.title}
          </h1>

          <p className="text-sm sm:text-base text-ink/80 leading-relaxed font-sans max-w-3xl">
            {magazine.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-editorial-border text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-muted block">Directorate</span>
              <span className="font-sans font-bold text-forest">{magazine.author}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-muted block">Editor(s)</span>
              <span className="font-sans font-bold text-forest">{magazine.editor}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-muted block">Document Extent</span>
              <span className="font-mono text-coral font-bold">{magazine.pageCount || 8} Pages</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-muted block">Archive File Size</span>
              <span className="font-mono text-coral font-bold">{magazine.fileSize || '14.2 MB'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3D Digital Flipbook Reading Suite */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-coral" />
            <span>Interactive Digital Flipbook Suite</span>
          </h2>
          <span className="text-xs text-muted hidden sm:inline font-sans">
            Real 3D double-page spread with corner mouse dragging & mobile swipe
          </span>
        </div>

        <FlipbookReader
          pdfUrl={magazine.pdfUrl}
          title={magazine.title}
          coverImage={magazine.coverImage}
          editionNumber={magazine.editionNumber}
          author={magazine.author}
          editor={magazine.editor}
          pageCount={magazine.pageCount}
        />
      </div>
    </div>
  );
}
