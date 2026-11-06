import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, MapPin, Play, Eye, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function ProgramsArchivePage() {
  const programs = db.getPrograms(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-canvas text-ink">
      {/* Masthead */}
      <div className="border-b border-editorial-border pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
          <Calendar className="w-3.5 h-3.5 text-coral" />
          <span>Cinematic Event Archive</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight">
          Programs, Conclaves & Expeditions
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed font-sans max-w-2xl mx-auto">
          A visual record of our class gatherings, academic symposia, mountain retreats, and cultural galas. Each event is preserved with high-resolution photography and video documentation.
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-white border border-editorial-border hover:border-forest/40 rounded-2xl overflow-hidden shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
          >
            <Link href={`/programs/${prog.id}`} className="block relative aspect-[16/10] bg-canvas overflow-hidden">
              <img
                src={prog.coverImage}
                alt={prog.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-forest text-white font-bold">
                  {prog.category}
                </span>
                {prog.isFeatured && (
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-coral text-white font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>
              {prog.youtubeUrl && (
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center shadow-coral">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
              )}
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-coral mb-2 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{prog.date}</span>
                </div>

                <h2 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2">
                  <Link href={`/programs/${prog.id}`}>{prog.title}</Link>
                </h2>

                <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-3">
                  <MapPin className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                  <span className="truncate">{prog.location}</span>
                </div>

                <p className="text-xs text-ink-light line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div className="pt-5 border-t border-editorial-border mt-5">
                <Link
                  href={`/programs/${prog.id}`}
                  className="w-full py-2.5 bg-canvas hover:bg-forest text-forest hover:text-white border border-editorial-border hover:border-forest text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-coral" />
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
