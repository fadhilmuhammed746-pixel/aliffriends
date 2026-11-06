import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Trophy } from 'lucide-react';

export const revalidate = 0;

export default function AchievementsPage() {
  const achievements = db.getAchievements(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-canvas text-ink">
      {/* Masthead */}
      <div className="border-b border-editorial-border pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
          <Trophy className="w-3.5 h-3.5 text-coral" />
          <span>Accolades & Distinctions</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight">
          Honours of Alif Friends 12
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed font-sans max-w-2xl mx-auto">
          Celebrating the trophies, literary citations, parliamentary debate victories, and sports titles secured by our class through collective discipline and grit.
        </p>
      </div>

      {/* Achievements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="bg-white border border-editorial-border hover:border-forest/40 rounded-2xl overflow-hidden shadow-card transition-all duration-300 flex flex-col sm:flex-row group hover:-translate-y-1.5"
          >
            <div className="sm:w-2/5 relative aspect-video sm:aspect-auto overflow-hidden bg-canvas">
              <img
                src={ach.imageUrl}
                alt={ach.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-forest text-white font-bold">
                {ach.category}
              </span>
            </div>

            <div className="sm:w-3/5 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-coral mb-2 font-semibold">
                  <span>{ach.date}</span>
                  {ach.badgeTitle && (
                    <span className="px-2 py-0.5 rounded bg-forest text-white font-bold text-[10px]">
                      {ach.badgeTitle}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2">
                  {ach.title}
                </h2>

                {ach.awardedBy && (
                  <p className="text-xs text-forest-700 font-medium mb-3">
                    Conferred by: {ach.awardedBy}
                  </p>
                )}

                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  {ach.description}
                </p>
              </div>

              <div className="pt-4 border-t border-editorial-border mt-4 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                <span>Class Honor Record</span>
                <span className="text-coral font-bold">Verified Distinction</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
