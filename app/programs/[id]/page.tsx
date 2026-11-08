import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ArrowLeft, Calendar, MapPin, Sparkles, Image as ImageIcon, Video, FileText, Download } from 'lucide-react';
import { Container, Card, Badge, Button } from '@/components/ui';

export const revalidate = 0;

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await db.getProgramById(id);

  if (!program || !program.isPublished) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16 space-y-10 bg-canvas text-ink">
      <Container size="narrow">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-tag text-forest hover:text-coral transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-coral" />
            <span>Back to Programs Archive</span>
          </Link>
        </div>

        {/* Program Header */}
        <div className="space-y-4 border-b border-editorial-border pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="forest">{program.category}</Badge>
            {program.isFeatured && (
              <Badge variant="urgent" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Featured Event
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-forest tracking-tight leading-tight">
            {program.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-ink-muted">
            <div className="flex items-center gap-2 text-coral font-bold">
              <Calendar className="w-4 h-4" />
              <span>{program.date}</span>
            </div>
            <div className="flex items-center gap-2 text-forest font-semibold">
              <MapPin className="w-4 h-4 text-forest" />
              <span>{program.location}</span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-card border border-editorial-border bg-white my-8">
          <img
            src={program.coverImage}
            alt={program.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description Card */}
        <Card className="p-6 sm:p-10 shadow-card space-y-4">
          <h2 className="font-serif text-lg font-bold text-forest uppercase tracking-tag">
            Event Chronicle & Overview
          </h2>
          <p className="text-sm sm:text-base text-ink-light leading-relaxed font-sans whitespace-pre-line">
            {program.description}
          </p>
        </Card>

        {/* Video Highlight (if available) */}
        {(program.youtubeUrl || program.videoUrl) && (
          <div className="space-y-4 pt-4">
            <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
              <Video className="w-5 h-5 text-coral" />
              <span>Cinematic Broadcast & Video Highlights</span>
            </h2>
            <div className="rounded-xl overflow-hidden border border-editorial-border shadow-card bg-forest-950">
              <VideoPlayer
                videoType={program.youtubeUrl ? 'youtube' : 'direct'}
                youtubeUrl={program.youtubeUrl}
                videoUrl={program.videoUrl}
                thumbnailUrl={program.coverImage}
                title={program.title}
              />
            </div>
          </div>
        )}

        {/* Archival Photography Gallery */}
        {program.photos && program.photos.length > 0 && (
          <div className="space-y-6 pt-4">
            <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-coral" />
              <span>Archival Event Photography</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {program.photos.map((ph, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-editorial-border shadow-card group bg-white"
                >
                  <img
                    src={ph}
                    alt={`Event Photograph ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Itinerary / Schedule PDF */}
        {program.pdfUrl && (
          <Card className="p-6 flex items-center justify-between gap-4 shadow-card">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-forest">
                  {program.pdfTitle || `${program.title} - Official Schedule & Brochure.pdf`}
                </h3>
                <p className="font-mono text-xs text-ink-muted">Event Itinerary & Guide Document</p>
              </div>
            </div>
            <a
              href={program.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-forest hover:bg-forest-800 text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-subtle flex-shrink-0"
            >
              <Download className="w-4 h-4 text-coral-light" />
              <span>Download Schedule</span>
            </a>
          </Card>
        )}
      </Container>
    </div>
  );
}
