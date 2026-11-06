import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ArrowLeft, Calendar, MapPin, Sparkles, Image as ImageIcon, Video } from 'lucide-react';

export const revalidate = 0;

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = db.getProgramById(id);

  if (!program || !program.isPublished) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Programs Archive</span>
        </Link>
      </div>

      {/* Program Header */}
      <div className="space-y-4 border-b border-gold/20 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-gold/15 text-gold border border-gold/30">
            {program.category}
          </span>
          {program.isFeatured && (
            <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-gold text-navy font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Event
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide">
          {program.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-muted-light">
          <div className="flex items-center gap-2 text-gold">
            <Calendar className="w-4 h-4" />
            <span>{program.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold" />
            <span>{program.location}</span>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gold/30">
        <img
          src={program.coverImage}
          alt={program.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Description */}
      <div className="bg-charcoal border border-gold/20 rounded-2xl p-6 sm:p-10 shadow-xl space-y-4">
        <h2 className="font-serif text-lg font-bold text-gold uppercase tracking-wider">
          Event Chronicle & Overview
        </h2>
        <p className="text-sm sm:text-base text-ivory/80 leading-relaxed font-sans whitespace-pre-line">
          {program.description}
        </p>
      </div>

      {/* Video Highlight (if available) */}
      {(program.youtubeUrl || program.videoUrl) && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-ivory flex items-center gap-2">
            <Video className="w-5 h-5 text-gold" />
            <span>Cinematic Broadcast & Video Highlights</span>
          </h2>
          <VideoPlayer
            videoType={program.youtubeUrl ? 'youtube' : 'direct'}
            youtubeUrl={program.youtubeUrl}
            videoUrl={program.videoUrl}
            thumbnailUrl={program.coverImage}
            title={program.title}
          />
        </div>
      )}

      {/* Photographs Gallery */}
      {program.photos && program.photos.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-lg font-bold text-ivory flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gold" />
            <span>Archival Event Photography</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {program.photos.map((ph, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-lg group"
              >
                <img
                  src={ph}
                  alt={`Event Photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
