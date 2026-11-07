import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { Video, Play, ExternalLink, Sparkles } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Button,
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';

export const revalidate = 0;

export default function VideosArchivePage() {
  const settings = db.getSettings();
  const videos = db.getVideos(true);
  const featured = videos.find((v) => v.isFeatured) || videos[0];
  const others = videos.filter((v) => v.id !== featured?.id);

  return (
    <div className="py-16 sm:py-20 bg-forest-950 text-canvas min-h-screen">
      <Container>
        {/* Header */}
        <SectionHeader
          dark={true}
          centered={true}
          eyebrow="Alif Creations 12 Channel"
          eyebrowColor="coral"
          title="Cinematic Video Center"
          subtitle="The definitive motion picture and broadcast archive of Alif Friends 12. Experience our full-length class documentary, live stage productions, and behind-the-scenes chronicles."
        />

        <div className="flex justify-center -mt-6 mb-12">
          <Button
            href={settings.officialYoutube}
            variant="ghost-light"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
            icon={<ExternalLink className="w-4 h-4 text-coral-light" />}
          >
            Subscribe @AlifCreations12 on YouTube
          </Button>
        </div>

        {videos.length === 0 ? (
          <EmptyState
            dark={true}
            icon={<Video className="w-6 h-6" />}
            title="No Videos in Archive"
            description="Our media editors are finalizing upcoming footage. Check back soon for new broadcast dispatches."
            actionHref="/"
            actionLabel="Return to Frontpage"
          />
        ) : (
          <div className="space-y-16">
            {/* Featured Video Highlight */}
            {featured && (
              <Card
                variant="dark"
                className="p-6 sm:p-10 shadow-lift border border-forest-800 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Badge variant="dark" icon={<Sparkles className="w-3.5 h-3.5 text-coral-light" />}>
                    Featured Masterpiece
                  </Badge>
                  <span className="font-mono text-xs text-coral-light font-bold">
                    Duration: {featured.duration}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 rounded-xl overflow-hidden border border-forest-800 shadow-2xl">
                    <VideoPlayer
                      videoType={featured.videoType}
                      youtubeUrl={featured.youtubeUrl}
                      videoUrl={featured.videoUrl}
                      thumbnailUrl={featured.thumbnailUrl}
                      title={featured.title}
                    />
                  </div>

                  <div className="lg:col-span-4 space-y-4">
                    <span className="text-[11px] font-mono text-coral-light uppercase tracking-tag font-bold">
                      {featured.category}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-canvas-muted leading-relaxed font-sans">
                      {featured.description}
                    </p>
                    <div className="pt-4 border-t border-forest-800">
                      <Link
                        href={`/videos/${featured.id}`}
                        className="text-xs font-serif font-bold text-coral-light hover:text-white uppercase tracking-tag inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Open Dedicated Cinema View</span>
                        &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Other Videos Grid (16:9 thumbnails, centered play button, duration badge) */}
            {others.length > 0 && (
              <div className="space-y-8">
                <div className="border-b border-forest-800 pb-3 flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Archival Reels & Collections
                  </h3>
                  <span className="font-mono text-xs text-canvas-muted">
                    {others.length} Titles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {others.map((vid) => (
                    <Card
                      key={vid.id}
                      variant="dark"
                      className="p-0 flex flex-col justify-between group"
                      hoverEffect={true}
                    >
                      <Link
                        href={`/videos/${vid.id}`}
                        className="block relative aspect-video overflow-hidden bg-forest-950 border-b border-forest-800"
                      >
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-forest-950/40 flex items-center justify-center transition-all group-hover:bg-forest-950/20">
                          <div className="w-12 h-12 rounded-full bg-coral text-white flex items-center justify-center shadow-coral transition-transform group-hover:scale-110">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono bg-forest-950/90 text-white px-2 py-0.5 rounded border border-forest-800 font-bold backdrop-blur-sm">
                          {vid.duration}
                        </span>
                      </Link>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <Badge variant="dark" size="sm" className="mb-2">
                            {vid.category}
                          </Badge>
                          <h4 className="font-serif text-lg font-bold text-white group-hover:text-coral-light transition-colors mb-2 line-clamp-1 leading-snug">
                            <Link href={`/videos/${vid.id}`}>{vid.title}</Link>
                          </h4>
                          <p className="text-xs text-canvas-muted line-clamp-2 leading-relaxed font-sans">
                            {vid.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-forest-800 mt-4">
                          <Link
                            href={`/videos/${vid.id}`}
                            className="text-xs font-serif font-bold text-coral-light hover:text-white uppercase tracking-tag flex items-center gap-1"
                          >
                            <span>Watch Reel</span>
                            &rarr;
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
