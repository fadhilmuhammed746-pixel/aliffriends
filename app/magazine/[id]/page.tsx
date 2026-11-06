import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { PdfReader } from '@/components/magazine/PdfReader';
import { ArrowLeft, BookOpen, Download } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-canvas text-ink">
      {/* Back button */}
      <div>
        <Link
          href="/magazine"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-forest hover:text-coral transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-coral" />
          <span>Back to Magazine Archive</span>
        </Link>
      </div>

      {/* Magazine Overview Header */}
      <div className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-10 shadow-card flex flex-col md:flex-row gap-8 items-start">
        <img
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-40 sm:w-56 aspect-[3/4] object-cover rounded-xl border border-editorial-border shadow-card flex-shrink-0"
        />

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-forest-50 text-forest border border-forest-100 font-bold">
              {magazine.editionNumber}
            </span>
            <span className="text-xs font-mono text-ink-muted">
              Released: {magazine.publicationDate}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
            {magazine.title}
          </h1>

          <p className="text-sm sm:text-base text-ink-light leading-relaxed font-sans max-w-3xl">
            {magazine.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-editorial-border text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-ink-muted block">Author</span>
              <span className="font-serif font-bold text-forest">{magazine.author}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-ink-muted block">Editor</span>
              <span className="font-serif font-bold text-forest">{magazine.editor}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-ink-muted block">Pages</span>
              <span className="font-mono text-coral font-bold">{magazine.pageCount || 0} Pages</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-ink-muted block">Archive Size</span>
              <span className="font-mono text-coral font-bold">{magazine.fileSize || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Online PDF Reader Viewport */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-forest flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-coral" />
            <span>Interactive Full-Resolution Reading Suite</span>
          </h2>
          <span className="text-xs text-ink-muted hidden sm:inline">
            Supports fullscreen mode, high-res zoom, and mobile viewport
          </span>
        </div>

        <PdfReader
          pdfUrl={magazine.pdfUrl}
          title={magazine.title}
          coverImage={magazine.coverImage}
          editionNumber={magazine.editionNumber}
        />
      </div>
    </div>
  );
}
