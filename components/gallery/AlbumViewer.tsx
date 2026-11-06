'use client';

import React, { useState } from 'react';
import { GalleryAlbum } from '@/lib/types';
import { Lightbox } from './Lightbox';
import { Play, Maximize2, Camera } from 'lucide-react';

export const AlbumViewer: React.FC<{ album: GalleryAlbum }> = ({ album }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightboxAt = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Quick Launch Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-charcoal border border-gold/20">
        <span className="text-xs font-mono text-muted-light">
          {album.photos.length} Archival Photographs
        </span>
        <button
          onClick={() => openLightboxAt(0)}
          className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-gold"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Start Fullscreen Slideshow</span>
        </button>
      </div>

      {/* Responsive Photo Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {album.photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => openLightboxAt(idx)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/20 hover:border-gold/60 cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1 bg-navy-950"
          >
            <img
              src={photo.url}
              alt={photo.caption || album.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover overlay with caption & expand icon */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
              <div className="self-end p-2 rounded-full bg-navy/80 text-gold border border-gold/30">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-serif text-xs font-bold text-ivory drop-shadow">
                  {photo.caption || `Record #${idx + 1}`}
                </p>
                {photo.date && (
                  <span className="text-[10px] font-mono text-gold/80 block mt-0.5">
                    {photo.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        photos={album.photos}
        initialIndex={photoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        albumTitle={album.title}
      />
    </div>
  );
};
