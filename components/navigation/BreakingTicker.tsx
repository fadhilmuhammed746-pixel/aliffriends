'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, ChevronRight } from 'lucide-react';

interface BreakingTickerProps {
  text?: string;
  show?: boolean;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  text = 'ALIF FRIENDS 12: Grand Reunion & Annual Magazine Edition XII is now officially live • Watch the new documentary on YouTube @AlifCreations12',
  show = true,
}) => {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) {
    return null;
  }

  if (!show || !text) return null;

  return (
    <div className="bg-forest text-canvas-warm text-xs border-b border-forest-800 py-2 px-4 overflow-hidden relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Label badge in Coral */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
          </span>
          <span className="font-serif uppercase tracking-tag text-[10px] text-coral-light font-bold flex items-center gap-1">
            <Flame className="w-3 h-3 text-coral" />
            Dispatch
          </span>
          <span className="text-forest-700">|</span>
        </div>

        {/* Marquee / Headline */}
        <div className="flex-1 overflow-hidden whitespace-nowrap text-xs text-canvas-warm/90 font-sans tracking-wide">
          <Link
            href="/newspaper"
            className="hover:text-coral-light transition-colors inline-flex items-center gap-2 group"
          >
            <span>{text}</span>
            <ChevronRight className="w-3 h-3 text-coral-light opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Date and Quick Link */}
        <div className="hidden md:flex items-center gap-3 text-[11px] text-canvas-muted flex-shrink-0">
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-forest-700">•</span>
          <Link
            href="/magazine"
            className="text-coral-light font-serif font-bold uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Read Edition XII</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
