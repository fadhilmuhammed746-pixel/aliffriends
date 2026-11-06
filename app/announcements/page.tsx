import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Bell, Calendar, Flame, AlertCircle, Info, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function AnnouncementsPage() {
  const announcements = db.getAnnouncements(true);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Masthead */}
      <div className="border-b border-gold/20 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest mb-4">
          <Bell className="w-3.5 h-3.5" />
          <span>Official Dispatch Desk</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide mb-4">
          Notices & Announcements
        </h1>
        <p className="text-sm text-ivory/70 leading-relaxed font-sans">
          The verified communication board for Alif Friends 12. Check here for official press releases, event timetables, literary deadlines, and assembly directives.
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`rounded-2xl p-6 sm:p-8 border shadow-xl transition-all ${
              ann.priority === 'high'
                ? 'bg-charcoal border-red-500/40'
                : 'bg-charcoal border-gold/20 hover:border-gold/40'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded border ${
                    ann.priority === 'high'
                      ? 'bg-red-950 text-red-300 border-red-500/30'
                      : 'bg-navy text-gold border border-gold/20'
                  }`}
                >
                  {ann.category}
                </span>

                {ann.priority === 'high' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-500/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-400" />
                    High Priority
                  </span>
                )}

                {ann.isFeatured && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold text-navy font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-light">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>Published: {ann.date}</span>
              </div>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ivory mb-3 leading-snug">
              {ann.title}
            </h2>

            <p className="text-sm text-ivory/80 leading-relaxed font-sans whitespace-pre-line">
              {ann.content}
            </p>

            <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-between text-[11px] font-mono text-muted-light">
              <span>Alif Friends 12 Secretariat</span>
              <span className="text-gold">Official Dispatch</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
