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

  // Extract YouTube ID safely
  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(youtubeUrl);

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-navy-950 border border-gold/30 shadow-2xl group">
      {!isPlaying ? (
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Cinematic Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

          {/* Central Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-gold/20 rounded-full animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-gold hover:bg-gold-light text-navy flex items-center justify-center shadow-gold transition-transform duration-300 group-hover:scale-110">
                <Play className="w-7 h-7 text-navy fill-navy ml-1" />
              </div>
            </div>
          </div>

          {/* Title bar at bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-ivory">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold bg-navy/80 px-2 py-0.5 rounded border border-gold/30">
              Cinematic Reel
            </span>
            <h4 className="font-serif text-lg font-bold text-ivory mt-1 line-clamp-1 drop-shadow">
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
            <div className="w-full h-full flex items-center justify-center text-ivory/60 font-serif">
              Video source unavailable
            </div>
          )}
        </div>
      )}
    </div>
  );
};
