import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Info, Sparkles, BookOpen, Compass, Shield, Heart, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default function AboutPage() {
  const settings = db.getSettings();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Masthead */}
      <div className="border-b border-gold/20 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest mb-4">
          <Info className="w-3.5 h-3.5" />
          <span>Editorial Manifesto</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide mb-4">
          The Story of Alif Friends 12
        </h1>
        <p className="font-serif italic text-gold text-base sm:text-lg">
          &ldquo;{settings.tagline}&rdquo;
        </p>
      </div>

      {/* Cinematic Hero Image */}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-gold/30">
        <img
          src={settings.heroImage}
          alt="Alif Friends 12 Class Group"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <span className="text-[11px] font-mono text-gold uppercase tracking-widest bg-navy/80 px-2 py-0.5 rounded border border-gold/30">
            Historic Class Archive
          </span>
        </div>
      </div>

      {/* Narrative Story */}
      <section className="bg-charcoal border border-gold/20 rounded-2xl p-8 sm:p-12 shadow-xl space-y-6">
        <h2 className="font-serif text-2xl font-bold text-ivory flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <span>Genesis & Purpose</span>
        </h2>
        <div className="prose prose-invert max-w-none text-ivory/80 font-sans text-base leading-relaxed space-y-4">
          <p className="text-lg text-ivory font-serif leading-relaxed">
            {settings.aboutStory}
          </p>
          <p>
            When our academic journey began, we recognized that ordinary classroom memories too often fade into scattered conversations. We resolved to build something enduring: a publication house and digital archive with the artistic discipline of an international journal.
          </p>
          <p>
            Through our annual magazine editions, investigative reports, photographic archives, and video documentaries produced under <em>Alif Creations 12</em>, we preserve the unyielding brotherhood and creative spirit of our generation.
          </p>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-charcoal border border-gold/20 rounded-2xl p-8 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-ivory">Our Mission</h3>
          <p className="text-sm text-ivory/75 font-sans leading-relaxed">
            {settings.aboutMission}
          </p>
        </div>

        <div className="bg-charcoal border border-gold/20 rounded-2xl p-8 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-ivory">Our Vision</h3>
          <p className="text-sm text-ivory/75 font-sans leading-relaxed">
            {settings.aboutVision}
          </p>
        </div>
      </div>

      {/* Founder Quote */}
      {settings.founderQuote && (
        <section className="bg-navy-950 border border-gold/30 rounded-2xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-4xl font-serif text-gold leading-none">&ldquo;</span>
            <blockquote className="font-serif italic text-lg sm:text-2xl text-ivory leading-relaxed">
              {settings.founderQuote.replace(/^["“”]|["“”]$/g, '')}
            </blockquote>
            <span className="text-xs font-mono uppercase tracking-widest text-gold block pt-2">
              — Alif Friends 12 Class Representative
            </span>
          </div>
        </section>
      )}

      {/* CTA to Connect */}
      <div className="text-center space-y-4 pt-6 border-t border-gold/15">
        <h3 className="font-serif text-xl font-bold text-ivory">
          Connect with the Editorial Directorate
        </h3>
        <p className="text-xs text-muted-light max-w-md mx-auto font-sans">
          Have an inquiry, historical memoir, or press release? Get in touch with our newsroom directly.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-gold"
          >
            <span>Visit Contact & Channels</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
