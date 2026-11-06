import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-charcoal border border-gold/25 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-gold">
            Error 404 • Missing Record
          </span>
          <h1 className="font-serif text-3xl font-bold text-ivory">
            Page Not Found
          </h1>
          <p className="text-xs text-muted-light font-sans leading-relaxed">
            The archival dispatch or edition you are searching for does not exist or has been relocated to another section of the platform.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-gold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
