import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { Video, Play, ExternalLink, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function VideosArchivePage() {
  const settings = db.getSettings();
  const videos = db.getVideos(true);
  const featured = videos.find((v) => v.isFeatured) || videos[0];
  const others = videos.filter((v) => v.id !== featured?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="border-b border-gold/20 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest mb-4">
          <Video className="w-3.5 h-3.5" />
          <span>Alif Creations 12 Channel</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide mb-4">
          Cinematic Video Center
        </h1>
        <p className="text-sm text-ivory/70 leading-relaxed font-sans">
          The premier video archive of Alif Friends 12. Experience our full-length class documentary, live stage performances, and behind-the-scenes editing suite chronicles.
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href={settings.officialYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-serif font-bold uppercase tracking-wider transition-colors shadow-lg"
          >
            <span>Subscribe @AlifCreations12 on YouTube</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Featured Video Highlight */}
      {featured && (
        <div className="bg-charcoal border border-gold/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-gold/15 text-gold border border-gold/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Masterpiece
            </span>
            <span className="text-xs font-mono text-muted-light">
              Duration: {featured.duration}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <VideoPlayer
                videoType={featured.videoType}
                youtubeUrl={featured.youtubeUrl}
                videoUrl={featured.videoUrl}
                thumbnailUrl={featured.thumbnailUrl}
                title={featured.title}
              />
            </div>

            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-mono text-gold uppercase tracking-wider">
                {featured.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory">
                {featured.title}
              </h2>
              <p className="text-xs sm:text-sm text-ivory/75 leading-relaxed font-sans">
                {featured.description}
              </p>
              <div className="pt-4 border-t border-gold/15">
                <Link
                  href={`/videos/${featured.id}`}
                  className="text-xs font-serif font-bold text-gold hover:text-gold-light uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Open Dedicated Cinema View</span>
                  &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Videos Grid */}
      {others.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-ivory border-b border-gold/15 pb-2">
            Archival Reels & Collections
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((vid) => (
              <div
                key={vid.id}
                className="bg-charcoal border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden shadow-lg transition-all group flex flex-col justify-between"
              >
                <Link href={`/videos/${vid.id}`} className="block relative aspect-video overflow-hidden">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gold/90 text-navy flex items-center justify-center shadow-gold transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-navy ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-navy/90 text-ivory px-2 py-0.5 rounded border border-gold/20">
                    {vid.duration}
                  </span>
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-gold block mb-1">
                      {vid.category}
                    </span>
                    <h4 className="font-serif text-base font-bold text-ivory group-hover:text-gold transition-colors mb-2 line-clamp-1">
                      <Link href={`/videos/${vid.id}`}>{vid.title}</Link>
                    </h4>
                    <p className="text-xs text-muted-light line-clamp-2">{vid.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gold/15 mt-4">
                    <Link
                      href={`/videos/${vid.id}`}
                      className="text-xs font-serif font-bold text-gold hover:text-gold-light uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>Watch Reel</span>
                      &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
