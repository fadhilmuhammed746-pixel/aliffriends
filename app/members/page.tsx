import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Users, Shield, Lock } from 'lucide-react';

export const revalidate = 0;

export default function ClassMembersPage() {
  const settings = db.getSettings();
  const members = db.getMembers(true);

  if (!settings.membersSectionEnabled) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6 bg-canvas text-ink">
        <div className="w-16 h-16 rounded-full bg-white border border-editorial-border flex items-center justify-center text-forest mx-auto shadow-subtle">
          <Lock className="w-8 h-8 text-coral" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest">Class Directory Restricted</h1>
        <p className="text-sm text-ink-muted leading-relaxed font-sans">
          The public class directory is currently closed by administrative policy. Please check back following the official release of our upcoming annual edition.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-forest text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-editorial"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-canvas text-ink">
      {/* Masthead */}
      <div className="border-b border-editorial-border pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
          <Users className="w-3.5 h-3.5 text-coral" />
          <span>Class Roster & Leadership</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight">
          The Cohort of Alif Friends 12
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed font-sans max-w-2xl mx-auto">
          A generation bound by intellect, loyalty, and artistic expression. Meet the executive council, editorial directors, and fellows who define the spirit of our class.
        </p>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((mem) => (
          <div
            key={mem.id}
            className="bg-white border border-editorial-border hover:border-forest/40 rounded-2xl p-6 sm:p-8 shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-5">
                <img
                  src={mem.photoUrl}
                  alt={mem.name}
                  className="w-28 h-28 rounded-full object-cover border-2 border-forest/30 shadow-subtle group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-forest border-2 border-white text-[11px] font-mono text-white flex items-center justify-center font-bold">
                  {mem.orderIndex}
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-forest mb-1">
                {mem.name}
              </h2>

              <span className="text-xs font-serif uppercase tracking-wider text-coral font-bold mb-4">
                {mem.position}
              </span>

              <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed mb-6">
                {mem.bio}
              </p>
            </div>

            {mem.quote && (
              <div className="pt-4 border-t border-editorial-border">
                <p className="text-xs font-serif italic text-forest leading-relaxed">
                  &ldquo;{mem.quote}&rdquo;
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-6 rounded-2xl bg-white border border-editorial-border text-center max-w-2xl mx-auto space-y-2 shadow-subtle">
        <span className="text-[11px] font-serif uppercase tracking-widest text-forest font-bold flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-coral" />
          Editorial Privacy Standard
        </span>
        <p className="text-xs text-ink-muted font-sans leading-relaxed">
          In strict compliance with our publication guidelines, personal telephone contacts and home addresses are never published. To reach any representative or editor, please contact our central editorial desk.
        </p>
      </div>
    </div>
  );
}
