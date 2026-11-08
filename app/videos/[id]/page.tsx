import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Container, Card, Badge, Button } from '@/components/ui';

export const revalidate = 0;

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await db.getVideoById(id);

  if (!video || !video.isPublished) {
    notFound();
  }

  const settings = await db.getSettings();

  return (
    <div className="py-12 sm:py-16 space-y-8 bg-forest-950 text-canvas min-h-screen">
      <Container size="narrow">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-tag text-canvas-muted hover:text-coral-light transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-coral-light" />
            <span>Back to Video Center</span>
          </Link>
        </div>

        {/* Video Player */}
        <div className="rounded-2xl overflow-hidden border border-forest-800 shadow-2xl bg-black">
          <VideoPlayer
            videoType={video.videoType}
            youtubeUrl={video.youtubeUrl}
            videoUrl={video.videoUrl}
            thumbnailUrl={video.thumbnailUrl}
            title={video.title}
            autoPlay={true}
          />
        </div>

        {/* Meta and Description Card */}
        <Card
          variant="dark"
          className="p-6 sm:p-8 shadow-card border border-forest-800 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forest-800 pb-4">
            <div className="flex items-center gap-3">
              <Badge variant="dark">{video.category}</Badge>
              <span className="text-xs font-mono text-coral-light font-bold">
                Duration: {video.duration}
              </span>
            </div>

            <a
              href={settings.officialYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-coral-light hover:text-white font-mono flex items-center gap-1.5 font-bold transition-colors"
            >
              <span>Alif Creations 12</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {video.title}
          </h1>

          <p className="text-sm sm:text-base text-canvas-muted leading-relaxed font-sans whitespace-pre-line">
            {video.description}
          </p>
        </Card>
      </Container>
    </div>
  );
}
