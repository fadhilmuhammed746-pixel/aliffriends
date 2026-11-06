'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Download,
  Info,
} from 'lucide-react';
import { GalleryPhoto } from '@/lib/types';

interface LightboxProps {
  photos: GalleryPhoto[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  albumTitle?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
  albumTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Slideshow timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, handleNext]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-navy/98 backdrop-blur-2xl flex flex-col justify-between select-none">
      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gold/15 bg-charcoal/60 z-20">
        <div className="flex items-center gap-3">
          <span className="text-gold font-serif font-bold text-sm tracking-widest uppercase">
            {albumTitle || 'Class Photo Archive'}
          </span>
          <span className="text-ivory/40">•</span>
          <span className="text-xs font-mono text-ivory/80">
            {currentIndex + 1} of {photos.length}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Slideshow Button */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition-colors border ${
              isPlaying
                ? 'bg-gold text-navy border-gold font-bold'
                : 'bg-charcoal text-ivory hover:text-gold border-gold/30'
            }`}
            title="Auto-play Slideshow (Spacebar)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Slideshow</span>
              </>
            )}
          </button>

          {/* Toggle Caption */}
          <button
            onClick={() => setShowInfo((s) => !s)}
            className="p-2 text-ivory/70 hover:text-gold rounded-lg hover:bg-charcoal transition-colors border border-gold/20"
            title="Toggle Description"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Download Original */}
          <a
            href={currentPhoto.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-2 text-ivory/70 hover:text-gold rounded-lg hover:bg-charcoal transition-colors border border-gold/20"
            title="Open / Download Full Image"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Close Lightbox */}
          <button
            onClick={onClose}
            className="p-2 text-ivory/90 hover:text-gold rounded-lg hover:bg-charcoal transition-colors border border-gold/30"
            title="Close Viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-charcoal/80 hover:bg-gold hover:text-navy text-ivory rounded-full transition-all border border-gold/30 shadow-2xl z-20 group"
          aria-label="Previous Photo"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-charcoal/80 hover:bg-gold hover:text-navy text-ivory rounded-full transition-all border border-gold/30 shadow-2xl z-20 group"
          aria-label="Next Photo"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Display Image with subtle frame */}
        <div className="relative max-w-full max-h-[75vh] flex items-center justify-center">
          <img
            key={currentPhoto.id || currentIndex}
            src={currentPhoto.url}
            alt={currentPhoto.caption || currentPhoto.alt || 'Alif Friends 12 Memory'}
            className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-gold/20 animate-fade-in"
          />
        </div>
      </div>

      {/* Caption & Thumbnail Strip */}
      <div className="px-6 py-4 bg-charcoal-deep border-t border-gold/15 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        {showInfo && (
          <div className="text-center md:text-left">
            <h4 className="font-serif text-sm font-bold text-ivory tracking-wide">
              {currentPhoto.caption || 'Alif Friends 12 Archival Record'}
            </h4>
            {currentPhoto.date && (
              <span className="text-[11px] font-mono text-gold/80 block mt-0.5">
                Recorded: {currentPhoto.date}
              </span>
            )}
          </div>
        )}

        {/* Mini Thumbnail strip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-md py-1">
          {photos.map((ph, idx) => (
            <button
              key={ph.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-12 h-10 rounded overflow-hidden border transition-all ${
                idx === currentIndex
                  ? 'border-gold ring-2 ring-gold/40 scale-105'
                  : 'border-gold/20 opacity-50 hover:opacity-100'
              }`}
            >
              <img src={ph.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
