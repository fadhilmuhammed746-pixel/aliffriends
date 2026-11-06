import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { BookOpen, Download, Eye, Calendar, Sparkles, Search } from 'lucide-react';

export const revalidate = 0;

export default function MagazineArchivePage() {
  const magazines = db.getMagazines(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-gold/20 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Archival Publication Library</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide mb-4">
          Digital Magazine Archive
        </h1>
        <p className="text-sm text-ivory/70 leading-relaxed font-sans">
          Immerse yourself in our premier annual class publications. Browse comprehensive retrospective memoirs, essays, photographic spreads, and high-definition downloadable PDFs.
        </p>
      </div>

      {/* Grid of Magazines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {magazines.map((mag) => (
          <div
            key={mag.id}
            className="bg-charcoal border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
          >
            {/* Magazine Cover */}
            <Link href={`/magazine/${mag.id}`} className="block relative aspect-[3/4] bg-navy-950 overflow-hidden">
              <img
                src={mag.coverImage}
                alt={mag.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-navy/90 text-gold border border-gold/30">
                  {mag.editionNumber}
                </span>
                {mag.isFeatured && (
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-gold text-navy font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>
            </Link>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-gold/80 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{mag.publicationDate} • {mag.pageCount || 0} Pages</span>
                </div>

                <h2 className="font-serif text-xl font-bold text-ivory group-hover:text-gold transition-colors mb-2">
                  <Link href={`/magazine/${mag.id}`}>{mag.title}</Link>
                </h2>

                <p className="text-xs text-muted-light line-clamp-3 leading-relaxed mb-4">
                  {mag.description}
                </p>

                <div className="text-[11px] font-mono text-ivory/60 space-y-0.5 border-t border-gold/10 pt-3">
                  <div>Author: <span className="text-ivory/90">{mag.author}</span></div>
                  <div>Editor: <span className="text-ivory/90">{mag.editor}</span></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-gold/15 mt-5 flex items-center justify-between gap-3">
                <Link
                  href={`/magazine/${mag.id}`}
                  className="flex-1 py-2.5 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-gold"
                >
                  <Eye className="w-3.5 h-3.5 text-navy" />
                  <span>Read Online</span>
                </Link>

                <a
                  href={mag.pdfUrl}
                  download
                  className="p-2.5 bg-navy hover:bg-navy-light text-ivory border border-gold/25 hover:border-gold rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4 text-gold" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
