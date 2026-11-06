import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Info, Sparkles, Compass, Shield, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default function AboutPage() {
  const settings = db.getSettings();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-canvas text-ink">
      {/* Masthead */}
      <div className="border-b border-editorial-border pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
          <Info className="w-3.5 h-3.5 text-coral" />
          <span>Editorial Manifesto</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight">
          The Story of Alif Friends 12
        </h1>
        <p className="font-editorial italic text-coral text-lg sm:text-xl">
          &ldquo;{settings.tagline}&rdquo;
        </p>
      </div>

      {/* Cinematic Hero Image */}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-card border border-editorial-border bg-white">
        <img
          src={settings.heroImage}
          alt="Alif Friends 12 Class Group"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-6">
          <span className="text-[11px] font-mono text-white uppercase tracking-widest bg-forest/80 px-2.5 py-0.5 rounded border border-white/20 font-bold">
            Historic Class Archive
          </span>
        </div>
      </div>

      {/* Narrative Story with Editorial Drop Cap */}
      <section className="bg-white border border-editorial-border rounded-2xl p-8 sm:p-12 shadow-card space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-coral" />
          <span>Genesis & Purpose</span>
        </h2>
        <div className="editorial-dropcap prose-editorial max-w-none text-ink-light font-sans text-base sm:text-lg leading-relaxed space-y-4">
          <p className="text-xl text-forest font-serif leading-relaxed">
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
        <div className="bg-white border border-editorial-border rounded-2xl p-8 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest">
            <Compass className="w-6 h-6 text-coral" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-forest">Our Mission</h3>
          <p className="text-sm sm:text-base text-ink-light font-sans leading-relaxed">
            {settings.aboutMission}
          </p>
        </div>

        <div className="bg-white border border-editorial-border rounded-2xl p-8 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest">
            <Shield className="w-6 h-6 text-coral" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-forest">Our Vision</h3>
          <p className="text-sm sm:text-base text-ink-light font-sans leading-relaxed">
            {settings.aboutVision}
          </p>
        </div>
      </div>

      {/* Founder Quote */}
      {settings.founderQuote && (
        <section className="bg-forest text-white border border-forest-800 rounded-2xl p-8 sm:p-12 shadow-lift text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-5xl font-serif text-coral leading-none">&ldquo;</span>
            <blockquote className="font-editorial italic text-xl sm:text-2xl text-white leading-relaxed">
              {settings.founderQuote.replace(/^["“”]|["“”]$/g, '')}
            </blockquote>
            <span className="text-xs font-mono uppercase tracking-widest text-coral-light block pt-2 font-bold">
              — Alif Friends 12 Class Representative
            </span>
          </div>
        </section>
      )}

      {/* CTA to Connect */}
      <div className="text-center space-y-4 pt-6 border-t border-editorial-border">
        <h3 className="font-serif text-2xl font-bold text-forest">
          Connect with the Editorial Directorate
        </h3>
        <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto font-sans">
          Have an inquiry, historical memoir, or press release? Get in touch with our newsroom directly.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest hover:bg-forest-800 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-editorial"
          >
            <span>Visit Contact & Channels</span>
            <ArrowRight className="w-4 h-4 text-coral" />
          </Link>
        </div>
      </div>
    </div>
  );
}
