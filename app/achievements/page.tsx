import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Trophy, Award, Star, Calendar, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function AchievementsPage() {
  const achievements = db.getAchievements(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Masthead */}
      <div className="border-b border-gold/20 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest mb-4">
          <Trophy className="w-3.5 h-3.5" />
          <span>Accolades & Distinctions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide mb-4">
          Honours of Alif Friends 12
        </h1>
        <p className="text-sm text-ivory/70 leading-relaxed font-sans">
          Celebrating the trophies, literary citations, parliamentary debate victories, and sports titles secured by our class through collective discipline and grit.
        </p>
      </div>

      {/* Achievements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="bg-charcoal border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col sm:flex-row group hover:-translate-y-1"
          >
            <div className="sm:w-2/5 relative aspect-video sm:aspect-auto overflow-hidden bg-navy-950">
              <img
                src={ach.imageUrl}
                alt={ach.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy/90 text-gold border border-gold/30">
                {ach.category}
              </span>
            </div>

            <div className="sm:w-3/5 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-gold/80 mb-2">
                  <span>{ach.date}</span>
                  {ach.badgeTitle && (
                    <span className="px-2 py-0.5 rounded bg-gold text-navy font-bold text-[10px]">
                      {ach.badgeTitle}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-lg font-bold text-ivory group-hover:text-gold transition-colors mb-2">
                  {ach.title}
                </h2>

                {ach.awardedBy && (
                  <p className="text-xs text-gold-light/90 font-medium mb-3">
                    Conferred by: {ach.awardedBy}
                  </p>
                )}

                <p className="text-xs text-muted-light leading-relaxed font-sans">
                  {ach.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gold/10 mt-4 flex items-center justify-between text-[11px] font-mono text-muted-light">
                <span>Class Honor Record</span>
                <span className="text-gold">Verified Distinction</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
