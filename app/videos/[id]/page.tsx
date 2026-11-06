import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ArrowLeft, ExternalLink } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-canvas text-ink">
      {/* Back button */}
      <div>
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-forest hover:text-coral transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-coral" />
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
      <div className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-editorial-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-forest-50 text-forest border border-forest-100 font-bold">
              {video.category}
            </span>
            <span className="text-xs font-mono text-ink-muted">
              Duration: {video.duration}
            </span>
          </div>

          <a
            href={settings.officialYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-coral hover:underline font-mono flex items-center gap-1.5 font-bold"
          >
            <span>Alif Creations 12</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest tracking-tight">
          {video.title}
        </h1>

        <p className="text-sm sm:text-base text-ink-light leading-relaxed font-sans whitespace-pre-line">
          {video.description}
        </p>
      </div>
    </div>
  );
}
