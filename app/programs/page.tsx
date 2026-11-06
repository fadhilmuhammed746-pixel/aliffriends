import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, MapPin, ArrowRight, Play, Eye, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function ProgramsArchivePage() {
  const programs = db.getPrograms(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Masthead */}
      <div className="border-b border-gold/20 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>Cinematic Event Archive</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide mb-4">
          Programs, Conclaves & Expeditions
        </h1>
        <p className="text-sm text-ivory/70 leading-relaxed font-sans">
          A visual record of our class gatherings, academic symposia, mountain retreats, and cultural galas. Each event is preserved with high-resolution photography and video documentation.
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-charcoal border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
          >
            <Link href={`/programs/${prog.id}`} className="block relative aspect-[16/10] bg-navy-950 overflow-hidden">
              <img
                src={prog.coverImage}
                alt={prog.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-navy/90 text-gold border border-gold/30">
                  {prog.category}
                </span>
                {prog.isFeatured && (
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-gold text-navy font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>
              {prog.youtubeUrl && (
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
              )}
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-gold/80 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{prog.date}</span>
                </div>

                <h2 className="font-serif text-xl font-bold text-ivory group-hover:text-gold transition-colors mb-2">
                  <Link href={`/programs/${prog.id}`}>{prog.title}</Link>
                </h2>

                <div className="flex items-center gap-1.5 text-xs text-muted-light mb-3">
                  <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span className="truncate">{prog.location}</span>
                </div>

                <p className="text-xs text-ivory/70 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div className="pt-5 border-t border-gold/15 mt-5">
                <Link
                  href={`/programs/${prog.id}`}
                  className="w-full py-2.5 bg-navy hover:bg-navy-light text-gold hover:text-gold-light border border-gold/30 hover:border-gold text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Explore Event Gallery</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
