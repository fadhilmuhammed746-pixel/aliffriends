import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, MapPin, Play, Eye, Sparkles } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Badge,
  Card,
  EmptyState,
  Button,
} from '@/components/ui';

export const revalidate = 0;

export default async function ProgramsArchivePage() {
  const programs = await db.getPrograms(true);

  return (
    <div className="py-16 sm:py-20 space-y-12 bg-canvas text-ink">
      <Container>
        {/* Masthead */}
        <SectionHeader
          centered={true}
          eyebrow="Cinematic Event Archive"
          eyebrowColor="coral"
          title="Programs, Conclaves & Expeditions"
          subtitle="A visual record of our class gatherings, academic symposia, mountain retreats, and cultural galas. Each event is preserved with high-resolution photography and video documentation."
        />

        {programs.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="No Programs Published"
            description="Our event curators are preparing upcoming program files for publication."
            actionHref="/"
            actionLabel="Return to Frontpage"
          />
        ) : (
          /* Programs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog) => (
              <Card
                key={prog.id}
                className="p-0 flex flex-col justify-between group"
                hoverEffect={true}
              >
                <Link href={`/programs/${prog.id}`} className="block relative aspect-[16/10] bg-canvas overflow-hidden">
                  <img
                    src={prog.coverImage}
                    alt={prog.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="forest">{prog.category}</Badge>
                    {prog.isFeatured && (
                      <Badge variant="urgent" icon={<Sparkles className="w-3 h-3" />}>
                        Featured
                      </Badge>
                    )}
                  </div>
                  {prog.youtubeUrl && (
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center shadow-coral">
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </div>
                  )}
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-coral mb-2 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{prog.date}</span>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2 leading-snug">
                      <Link href={`/programs/${prog.id}`}>{prog.title}</Link>
                    </h2>

                    <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-3">
                      <MapPin className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                      <span className="truncate">{prog.location}</span>
                    </div>

                    <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed font-sans">
                      {prog.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-editorial-border mt-5">
                    <Button
                      href={`/programs/${prog.id}`}
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      icon={<Eye className="w-3.5 h-3.5 text-coral" />}
                      iconPosition="left"
                    >
                      Explore Event Gallery
                    </Button>
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
