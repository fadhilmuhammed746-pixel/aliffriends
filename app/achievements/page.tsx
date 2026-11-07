import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Trophy, FileText, Video, Download } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';

export const revalidate = 0;

export default function AchievementsPage() {
  const achievements = db.getAchievements(true);

  return (
    <div className="py-16 sm:py-20 space-y-12 bg-canvas text-ink">
      <Container>
        {/* Masthead */}
        <SectionHeader
          centered={true}
          eyebrow="Accolades & Distinctions"
          eyebrowColor="coral"
          title="Honours of Alif Friends 12"
          subtitle="Celebrating the trophies, literary citations, parliamentary debate victories, and sports titles secured by our class through collective discipline and grit."
        />

        {achievements.length === 0 ? (
          <EmptyState
            icon={<Trophy className="w-6 h-6" />}
            title="No Accolades Recorded Yet"
            description="Our achievement register is being compiled for the upcoming edition."
            actionHref="/"
            actionLabel="Return to Frontpage"
          />
        ) : (
          /* Achievements Cards */
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

                    <h2 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2 leading-snug">
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
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest-50 hover:bg-forest-100 text-forest border border-forest-200 text-[11px] font-mono transition-colors font-semibold"
                          >
                            <Video className="w-3.5 h-3.5 text-coral" />
                            <span>Watch Presentation</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-editorial-border mt-4 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span>Class Honor Record</span>
                    <span className="text-forest font-semibold">Official Distinction</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
