import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ArrowLeft, Clock, Sparkles, ExternalLink, Video } from 'lucide-react';

export const revalidate = 0;

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = db.getVideoById(id);

  if (!video || !video.isPublished) {
    notFound();
  }

  const settings = db.getSettings();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Video Center</span>
        </Link>
      </div>

      {/* Video Player */}
      <div className="space-y-4">
        <VideoPlayer
          videoType={video.videoType}
          youtubeUrl={video.youtubeUrl}
          videoUrl={video.videoUrl}
          thumbnailUrl={video.thumbnailUrl}
          title={video.title}
          autoPlay={true}
        />
      </div>

      {/* Meta and Description */}
      <div className="bg-charcoal border border-gold/20 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/15 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-gold/15 text-gold border border-gold/30">
              {video.category}
            </span>
            <span className="text-xs font-mono text-muted-light">
              Duration: {video.duration}
            </span>
          </div>

          <a
            href={settings.officialYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1.5"
          >
            <span>Alif Creations 12</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ivory tracking-wide">
          {video.title}
        </h1>

        <p className="text-sm text-ivory/80 leading-relaxed font-sans whitespace-pre-line">
          {video.description}
        </p>
      </div>
    </div>
  );
}
