import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Info, Sparkles, Compass, Shield, ArrowRight } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Badge,
  Card,
  Button,
} from '@/components/ui';

export const revalidate = 0;

export default async function AboutPage() {
  const settings = await db.getSettings();

  return (
    <div className="py-16 sm:py-20 space-y-16 bg-canvas text-ink">
      <Container size="narrow">
        {/* Masthead */}
        <SectionHeader
          centered={true}
          eyebrow="Editorial Manifesto"
          eyebrowColor="coral"
          title="The Story of Alif Friends 12"
          subtitle={`"${settings.tagline}"`}
        />

        {/* Cinematic Hero Image */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-card border border-editorial-border bg-white my-8">
          <img
            src={settings.heroImage}
            alt="Alif Friends 12 Class Group"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6">
            <Badge variant="dark">Historic Class Archive</Badge>
          </div>
        </div>

        {/* Narrative Story with Editorial Drop Cap */}
        <Card className="p-8 sm:p-12 shadow-card space-y-6 my-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-coral" />
            <span>Genesis & Purpose</span>
          </h2>
          <div className="editorial-dropcap prose-editorial max-w-prose mx-auto text-ink font-sans leading-relaxed space-y-5">
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
        </Card>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <Card className="p-8 space-y-4" hoverEffect={true}>
            <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest">
              <Compass className="w-6 h-6 text-coral" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest">Our Mission</h3>
            <p className="text-sm sm:text-base text-ink-muted font-sans leading-relaxed">
              {settings.aboutMission}
            </p>
          </Card>

          <Card className="p-8 space-y-4" hoverEffect={true}>
            <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest">
              <Shield className="w-6 h-6 text-coral" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest">Our Vision</h3>
            <p className="text-sm sm:text-base text-ink-muted font-sans leading-relaxed">
              {settings.aboutVision}
            </p>
          </Card>
        </div>

        {/* Founder Quote */}
        {settings.founderQuote && (
          <section className="bg-forest-950 text-white border border-forest-800 rounded-2xl p-8 sm:p-14 shadow-lift text-center relative overflow-hidden my-12">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="text-5xl font-serif text-coral leading-none block">&ldquo;</span>
              <blockquote className="font-cormorant italic text-xl sm:text-3xl text-canvas-warm leading-relaxed">
                {settings.founderQuote.replace(/^["“”]|["“”]$/g, '')}
              </blockquote>
              <span className="text-xs font-mono uppercase tracking-tag text-coral-light block pt-3 font-bold">
                — Alif Friends 12 Class Representative
              </span>
            </div>
          </section>
        )}

        {/* CTA to Connect */}
        <div className="text-center space-y-4 pt-6 border-t border-editorial-border">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
            Engage With Our Editorial Board
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
            Have an archival dispatch, creative essay, or alumni memoir you wish to contribute to Edition XII?
          </p>
          <div className="pt-2">
            <Button href="/contact" variant="coral" size="md">
              Contact The Directorate
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
