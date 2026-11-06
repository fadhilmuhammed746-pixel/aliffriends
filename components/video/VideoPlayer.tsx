'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  videoType: 'youtube' | 'direct';
  youtubeUrl?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  title: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoType,
  youtubeUrl,
  videoUrl,
  thumbnailUrl,
  title,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(youtubeUrl);

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-forest-950 border border-editorial-border shadow-card group">
      {!isPlaying ? (
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent" />

          {/* Central Play Button with Coral Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-coral/25 rounded-full animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-coral hover:bg-coral-dark text-white flex items-center justify-center shadow-coral transition-transform duration-300 group-hover:scale-110">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </div>
          </div>

          {/* Title bar at bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[10px] font-mono uppercase tracking-widest text-coral-light bg-forest/80 px-2 py-0.5 rounded border border-forest-600">
              Cinematic Reel
            </span>
            <h4 className="font-serif text-lg font-bold text-white mt-1 line-clamp-1 drop-shadow">
              {title}
            </h4>
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          {videoType === 'youtube' && youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60 font-serif">
              Video source unavailable
            </div>
          )}
        </div>
      )}
    </div>
  );
};
