import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  institutionDFIA,
  coreValues,
  saafAndSports,
  siteIdentity,
} from '@/lib/content';
import {
  Sparkles,
  Compass,
  Shield,
  BookOpen,
  GraduationCap,
  Heart,
  Trophy,
  ExternalLink,
  Building,
  Users,
  Award,
  ChevronRight,
} from 'lucide-react';
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
          eyebrow="OFFICIAL BATCH & INSTITUTIONAL IDENTITY"
          eyebrowColor="coral"
          title="About ALIF FRIENDS 12 & Darul Falah"
          subtitle={`"${siteIdentity.slogan}"`}
        />

        {/* Hero Cinematic Presentation */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-card border border-editorial-border bg-white my-8">
          <img
            src={settings.heroImage}
            alt="Alif Friends 12 Class Group"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-center justify-between gap-2 text-white">
            <div>
              <Badge variant="coral">The 12th Batch</Badge>
              <h3 className="font-serif text-lg sm:text-xl font-bold mt-1 text-white">
                Darul Falah Islamic Academy · Taliparamba
              </h3>
            </div>
            <span className="text-xs font-mono text-canvas-muted">
              Taliparamba · Kannur · Kerala
            </span>
          </div>
        </div>

        {/* 1. CORE INTRODUCTION & BATCH IDENTITY */}
        <Card className="p-8 sm:p-12 shadow-card space-y-6 my-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-coral" />
            <span>The Identity of ALIF FRIENDS 12</span>
          </h2>
          <div className="prose-editorial text-ink font-sans leading-relaxed space-y-5">
            <p className="text-lg text-forest font-serif leading-relaxed italic border-l-4 border-coral pl-4">
              &ldquo;{siteIdentity.expandedIntro}&rdquo;
            </p>
            <p className="text-sm sm:text-base text-ink-muted">
              {siteIdentity.coreIntro}
            </p>
            <p className="text-sm sm:text-base text-ink-muted">
              From our earliest classroom discussions and joint study sessions to grand literary festivals, sports matches, and graduation, ALIF FRIENDS 12 stands as an enduring testament to our collective bond, intellectual curiosity, and shared ambition.
            </p>
          </div>
        </Card>

        {/* 2. ABOUT DARUL FALAH ISLAMIC ACADEMY */}
        <section className="space-y-6 my-12">
          <div className="border-b border-editorial-border pb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-tag text-coral font-bold">
              <Building className="w-4 h-4" />
              <span>Verified Institutional Profile</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              About Darul Falah Islamic Academy (DFIA)
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Taliparamba, Kannur District, Kerala, India · Affiliated to Darul Huda Islamic University (DHIU)
            </p>
          </div>

          <Card className="p-8 space-y-6 bg-white border border-editorial-border">
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-ink leading-relaxed">
                {institutionDFIA.summary}
              </p>
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-tag text-forest font-bold block">
                  Institutional Vision
                </span>
                <p className="text-xs sm:text-sm text-forest-800 font-serif leading-relaxed italic">
                  &ldquo;{institutionDFIA.vision}&rdquo;
                </p>
              </div>
            </div>

            {/* Three Institutional Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-editorial-border">
              {/* Pillar 1: Islamic Education */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-forest font-serif font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-coral" />
                  <span>Islamic Education</span>
                </div>
                <ul className="text-xs text-ink-muted space-y-1.5 font-sans">
                  {institutionDFIA.islamicEducation.map((subj) => (
                    <li key={subj} className="flex items-start gap-1.5">
                      <span className="text-coral mt-0.5">•</span>
                      <span>{subj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pillar 2: Formal Education */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-forest font-serif font-bold text-sm">
                  <GraduationCap className="w-4 h-4 text-coral" />
                  <span>Formal Education</span>
                </div>
                <ul className="text-xs text-ink-muted space-y-1.5 font-sans">
                  {institutionDFIA.formalEducation.map((subj) => (
                    <li key={subj} className="flex items-start gap-1.5">
                      <span className="text-coral mt-0.5">•</span>
                      <span>{subj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pillar 3: Campus Life */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-forest font-serif font-bold text-sm">
                  <Heart className="w-4 h-4 text-coral" />
                  <span>Campus Life</span>
                </div>
                <ul className="text-xs text-ink-muted space-y-1.5 font-sans">
                  {institutionDFIA.campusLife.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="text-coral mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Clear External Link & Institutional Disclaimer */}
            <div className="pt-6 border-t border-editorial-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-canvas-warm p-4 rounded-xl">
              <div>
                <span className="text-xs font-serif font-bold text-forest block">
                  Official Academy Portal
                </span>
                <span className="text-[11px] text-ink-muted font-sans">
                  ALIF FRIENDS 12 is the independent digital archive of the 12th batch. For institutional administration, admissions, and official circulars, visit the official academy website.
                </span>
              </div>
              <a
                href={institutionDFIA.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-serif uppercase tracking-wider font-bold transition-all shadow-subtle flex-shrink-0"
              >
                <span>Visit darulfalah.in</span>
                <ExternalLink className="w-3.5 h-3.5 text-coral-light" />
              </a>
            </div>
          </Card>
        </section>

        {/* 3. CORE VALUES GRID */}
        <section className="space-y-6 my-12">
          <div className="border-b border-editorial-border pb-4 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-tag text-coral font-bold block">
              Ethos & Guiding Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              Core Values of ALIF FRIENDS 12
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreValues.map((val, idx) => (
              <Card key={val.title} className="p-5 space-y-2 hover:border-forest/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-coral">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <h4 className="font-serif font-bold text-forest text-base">
                    {val.title}
                  </h4>
                </div>
                <p className="text-xs text-ink-muted font-sans leading-relaxed">
                  {val.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. SAAF SUPER LEAGUE (SPL) & SPORTS JOURNEY */}
        <section className="space-y-6 my-12">
          <div className="border-b border-editorial-border pb-4">
            <span className="text-xs font-mono uppercase tracking-tag text-coral font-bold block">
              Sports & Athletic Milestones
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              SAAF Super League (SPL) Journey
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              {saafAndSports.leagueIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {saafAndSports.achievements.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-white border border-forest-800 shadow-card space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="coral">{item.badge}</Badge>
                  <Trophy className="w-5 h-5 text-coral-light" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-canvas-muted block">
                    {item.tournament}
                  </span>
                  <h3 className="font-serif text-2xl font-black text-white tracking-wide mt-1">
                    {item.result}
                  </h3>
                </div>
                <p className="text-xs text-canvas-muted font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. MISSION & VISION */}
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
          <section className="bg-forest-950 text-white border border-forest-800 rounded-2xl p-8 sm:p-12 shadow-lift text-center relative overflow-hidden my-12">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="text-5xl font-serif text-coral leading-none block">&ldquo;</span>
              <blockquote className="font-cormorant italic text-xl sm:text-2xl text-canvas-warm leading-relaxed">
                {settings.founderQuote.replace(/^["“”]|["“”]$/g, '')}
              </blockquote>
              <span className="text-xs font-mono uppercase tracking-tag text-coral-light block pt-2 font-bold">
                — ALIF FRIENDS 12 · 12th Batch, Darul Falah Islamic Academy
              </span>
            </div>
          </section>
        )}

        {/* Connect Callout */}
        <div className="text-center space-y-4 pt-6 border-t border-editorial-border">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
            Connect With ALIF FRIENDS 12
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
            Direct all inquiries, submissions, and letters to our verified editorial desk.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button href="/contact" variant="coral" size="md">
              Contact Editorial Desk
            </Button>
            <Button href="/magazine" variant="forest" size="md">
              Read Magazine XII
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
