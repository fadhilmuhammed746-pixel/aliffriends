import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { BookOpen, Download, Eye, Calendar, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function MagazineArchivePage() {
  const magazines = db.getMagazines(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-canvas text-ink">
      {/* Header */}
      <div className="border-b border-editorial-border pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-coral" />
          <span>Archival Publication Library</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight">
          Digital Magazine Archive
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed font-sans max-w-2xl mx-auto">
          Immerse yourself in our premier annual printed-magazine-inspired publications. Browse comprehensive retrospective memoirs, essays, photographic spreads, and high-definition downloadable PDFs.
        </p>
      </div>

      {/* Grid of Magazines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {magazines.map((mag) => (
          <div
            key={mag.id}
            className="bg-white border border-editorial-border hover:border-forest/40 rounded-2xl overflow-hidden shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
          >
            {/* Magazine Cover */}
            <Link href={`/magazine/${mag.id}`} className="block relative aspect-[3/4] bg-[#FAF9F5] p-3 overflow-hidden">
              <img
                src={mag.coverImage}
                alt={mag.title}
                className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105 shadow-subtle"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-forest text-white font-bold">
                  {mag.editionNumber}
                </span>
                {mag.isFeatured && (
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-coral text-white font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>
            </Link>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-coral mb-2 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{mag.publicationDate} • {mag.pageCount || 0} Pages</span>
                </div>

                <h2 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2">
                  <Link href={`/magazine/${mag.id}`}>{mag.title}</Link>
                </h2>

                <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed mb-4 font-sans">
                  {mag.description}
                </p>

                <div className="text-[11px] font-mono text-ink-muted space-y-0.5 border-t border-editorial-border pt-3">
                  <div>Director: <span className="text-forest font-medium">{mag.author}</span></div>
                  <div>Editor: <span className="text-forest font-medium">{mag.editor}</span></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-editorial-border mt-5 flex items-center justify-between gap-3">
                <Link
                  href={`/magazine/${mag.id}`}
                  className="flex-1 py-2.5 bg-forest hover:bg-forest-800 text-white text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-subtle"
                >
                  <Eye className="w-3.5 h-3.5 text-coral-light" />
                  <span>Read Online</span>
                </Link>

                <a
                  href={mag.pdfUrl}
                  download
                  className="p-2.5 bg-white hover:bg-canvas text-forest border border-editorial-border hover:border-forest rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4 text-coral" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
