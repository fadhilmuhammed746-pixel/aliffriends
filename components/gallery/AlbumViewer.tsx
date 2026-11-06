'use client';

import React, { useState } from 'react';
import { GalleryAlbum } from '@/lib/types';
import { Lightbox } from './Lightbox';
import { Play, Maximize2, Video, FileText, Download } from 'lucide-react';

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
      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-editorial-border shadow-subtle">
        <span className="text-xs font-mono text-ink-muted">
          {album.photos.length} Archival Photographs
        </span>
        <button
          onClick={() => openLightboxAt(0)}
          className="px-4 py-2 bg-coral hover:bg-coral-dark text-white text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-coral"
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
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-editorial-border hover:border-forest/50 cursor-pointer shadow-subtle transition-all duration-300 hover:-translate-y-1 bg-white"
          >
            <img
              src={photo.url}
              alt={photo.caption || album.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover overlay with caption & expand icon */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
              <div className="self-end p-2 rounded-full bg-forest/80 text-white border border-forest-600">
                <Maximize2 className="w-4 h-4 text-coral-light" />
              </div>
              <div>
                <p className="font-serif text-xs font-bold text-white drop-shadow">
                  {photo.caption || `Record #${idx + 1}`}
                </p>
                {photo.date && (
                  <span className="text-[10px] font-mono text-coral-light block mt-0.5">
                    {photo.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Album Video Highlights */}
      {album.videos && album.videos.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-editorial-border">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-coral" />
            <h3 className="font-serif font-bold text-lg text-forest">
              Album Video Reels & Highlights
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {album.videos.map((vidUrl, vIdx) => (
              <div key={vIdx} className="rounded-xl overflow-hidden bg-black border border-editorial-border aspect-video">
                <video src={vidUrl} controls className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Album PDF Document */}
      {album.pdfUrl && (
        <div className="p-5 rounded-2xl bg-white border border-editorial-border flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-forest">
                {album.pdfTitle || `${album.title} - Official Booklet.pdf`}
              </h4>
              <p className="font-mono text-[11px] text-ink-muted">Commemorative PDF Document Attachment</p>
            </div>
          </div>
          <a
            href={album.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-forest hover:bg-forest-light text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      )}

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
