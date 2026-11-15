import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Trophy, FileText, Video, Download, Award, Shield } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';
import { saafAndSports } from '@/lib/content';

export const revalidate = 0;

export default async function AchievementsPage() {
  const achievements = await db.getAchievements(true);

  return (
    <div className="py-16 sm:py-20 space-y-16 bg-canvas text-ink">
      <Container>
        {/* Masthead */}
        <SectionHeader
          centered={true}
          eyebrow="Accolades & Sporting Milestones"
          eyebrowColor="coral"
          title="Achievements & Laurels"
          subtitle="Celebrating our academic, literary, cultural, creative and sporting achievements, including our SAAF Super League milestones."
        />

        {/* 1. DEDICATED SAAF SUPER LEAGUE (SPL) SECTION */}
        <section className="space-y-6">
          <div className="border-b border-editorial-border pb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-tag text-coral font-bold">
              <Trophy className="w-4 h-4" />
              <span>Official Sports & Super League Records</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              SAAF Super League (SPL) Achievements
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-2 max-w-3xl leading-relaxed font-sans">
              Our journey in the SAAF Super League reflects the spirit of teamwork, determination, healthy competition and sportsmanship. Across two appearances, our batch secured the Runner-up position once and the Second Runner-up position once.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Runner-up */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-white border border-forest-800 shadow-card space-y-5 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <Badge variant="coral">One-time achievement</Badge>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-coral" />
                </div>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-canvas-muted block">
                  SAAF SUPER LEAGUE
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-wide mt-1">
                  RUNNER-UP
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-canvas-muted leading-relaxed font-sans">
                Our batch demonstrated remarkable teamwork, resilience, and sporting prowess to emerge as the Runner-up in the SAAF Super League.
              </p>

              <div className="pt-4 border-t border-forest-800/80 flex items-center justify-between text-xs text-canvas-muted font-mono">
                <span>Batch Achievement</span>
                <span className="text-coral-light font-bold">Runner-up Finalist</span>
              </div>
            </div>

            {/* Card 2: Second Runner-up */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-white border border-forest-800 shadow-card space-y-5 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <Badge variant="coral">One-time achievement</Badge>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-coral" />
                </div>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-canvas-muted block">
                  SAAF SUPER LEAGUE
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-wide mt-1">
                  SECOND RUNNER-UP
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-canvas-muted leading-relaxed font-sans">
                In a spirited display of athletic dedication and competitive grit, our batch secured the Second Runner-up position in the SAAF Super League.
              </p>

              <div className="pt-4 border-t border-forest-800/80 flex items-center justify-between text-xs text-canvas-muted font-mono">
                <span>Batch Achievement</span>
                <span className="text-coral-light font-bold">Podium Finish</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CLASS ACADEMIC & CULTURAL ACCOLADES */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-editorial-border pb-4">
            <span className="text-xs font-mono uppercase tracking-tag text-forest font-bold block">
              Class Register
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest mt-1">
              Academic, Literary & Cultural Honors
            </h2>
          </div>

          {achievements.length === 0 ? (
            <EmptyState
              icon={<Trophy className="w-6 h-6" />}
              title="No Additional Accolades Recorded"
              description="Additional honours and literary awards are currently being curated for the register."
              actionHref="/"
              actionLabel="Return to Frontpage"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievements.map((ach) => (
                <Card
                  key={ach.id}
                  className="p-0 flex flex-col sm:flex-row group"
                  hoverEffect={true}
                >
                  <div className="sm:w-2/5 relative aspect-video sm:aspect-auto overflow-hidden bg-canvas">
                    <img
                      src={ach.imageUrl}
                      alt={ach.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
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
                          <Badge variant="forest" size="sm">
                            {ach.badgeTitle}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2 leading-snug">
                        {ach.title}
                      </h3>

                      {ach.awardedBy && (
                        <p className="text-xs text-forest-700 font-medium mb-3">
                          Conferred by: {ach.awardedBy}
                        </p>
                      )}

                      <p className="text-xs text-ink-muted leading-relaxed font-sans">
                        {ach.description}
                      </p>

                      {/* Attached Video & Certificate Links */}
                      {(ach.pdfUrl || ach.videoUrl) && (
                        <div className="pt-3 flex flex-wrap items-center gap-2">
                          {ach.pdfUrl && (
                            <a
                              href={ach.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-coral/10 hover:bg-coral/20 text-coral border border-coral/20 text-[11px] font-mono transition-colors font-bold"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Certificate (PDF)</span>
                            </a>
                          )}
                          {ach.videoUrl && (
                            <a
                              href={ach.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest/10 hover:bg-forest/20 text-forest border border-forest/20 text-[11px] font-mono transition-colors font-bold"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Watch Video</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
