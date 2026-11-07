import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Users, Shield, Lock } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Button,
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';

export const revalidate = 0;

export default function ClassMembersPage() {
  const settings = db.getSettings();
  const members = db.getMembers(true);

  if (!settings.membersSectionEnabled) {
    return (
      <div className="py-24 bg-canvas text-ink">
        <Container size="narrow">
          <EmptyState
            icon={<Lock className="w-6 h-6" />}
            title="Class Directory Restricted"
            description="The public class directory is currently closed by administrative policy. Please check back following the official release of our upcoming annual edition."
            actionHref="/"
            actionLabel="Return to Frontpage"
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-20 space-y-16 bg-canvas text-ink">
      <Container>
        {/* Masthead */}
        <SectionHeader
          centered={true}
          eyebrow="Class Roster & Leadership"
          eyebrowColor="coral"
          title="The Cohort of Alif Friends 12"
          subtitle="A generation bound by intellect, loyalty, and artistic expression. Meet the executive council, editorial directors, and fellows who define the spirit of our class."
        />

        {members.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="No Members Listed"
            description="The member roster is currently being updated by the secretariat."
            actionHref="/"
            actionLabel="Return to Frontpage"
          />
        ) : (
          /* Members Grid: portrait cards with name, role, and short quote in Cormorant italic */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((mem) => (
              <Card
                key={mem.id}
                className="p-6 sm:p-8 flex flex-col justify-between text-center group"
                hoverEffect={true}
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-5">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-forest/20 shadow-subtle">
                      <img
                        src={mem.photoUrl}
                        alt={mem.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-forest border-2 border-white text-[11px] font-mono text-white flex items-center justify-center font-bold">
                      {mem.orderIndex}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-forest mb-1 leading-snug">
                    {mem.name}
                  </h2>

                  <span className="text-xs font-serif uppercase tracking-tag text-coral font-bold mb-4">
                    {mem.position}
                  </span>

                  <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed mb-6">
                    {mem.bio}
                  </p>
                </div>

                {mem.quote && (
                  <div className="pt-4 border-t border-editorial-border">
                    <p className="font-cormorant italic text-sm sm:text-base text-forest leading-relaxed">
                      &ldquo;{mem.quote}&rdquo;
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Editorial Privacy Standard Notice */}
        <div className="mt-16 p-6 rounded-2xl bg-white border border-editorial-border text-center max-w-2xl mx-auto space-y-2 shadow-card">
          <span className="text-[11px] font-mono uppercase tracking-tag text-forest font-bold flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-coral" />
            Editorial Privacy Standard
          </span>
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            In strict compliance with our publication guidelines, personal telephone contacts and home addresses are never published. To reach any representative or editor, please contact our central editorial desk.
          </p>
        </div>
      </Container>
    </div>
  );
}
