'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface PdfReaderProps {
  pdfUrl: string;
  title: string;
  coverImage?: string;
  editionNumber?: string;
}

export const PdfReader: React.FC<PdfReaderProps> = ({
  pdfUrl,
  title,
  coverImage,
  editionNumber,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen error:', err);
      });
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative bg-charcoal-deep border border-gold/20 rounded-xl overflow-hidden shadow-2xl flex flex-col ${
        isFullscreen ? 'w-screen h-screen rounded-none border-none z-50 fixed inset-0' : 'h-[750px] w-full'
      }`}
    >
      {/* Editorial Reader Toolbar */}
      <div className="bg-navy px-4 py-3 border-b border-gold/20 flex flex-wrap items-center justify-between gap-3 text-ivory z-20">
        <div className="flex items-center gap-3">
          <span className="p-1.5 bg-gold/10 text-gold rounded border border-gold/30">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-sm text-ivory tracking-wide truncate max-w-xs md:max-w-md">
              {title}
            </h3>
            {editionNumber && (
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold">
                {editionNumber} • Online Reading Suite
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-charcoal rounded-lg border border-gold/20 px-1 py-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="p-1.5 text-ivory/70 hover:text-gold transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-ivory/90">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 15))}
              className="p-1.5 text-ivory/70 hover:text-gold transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rotate */}
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 bg-charcoal text-ivory/70 hover:text-gold rounded-lg border border-gold/20 transition-colors hidden md:block"
            title="Rotate Page"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Download button */}
          <a
            href={pdfUrl}
            download
            className="px-3 py-1.5 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
          >
            <Download className="w-3.5 h-3.5 text-navy" />
            <span className="hidden sm:inline">Download PDF</span>
          </a>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-charcoal text-gold hover:text-ivory rounded-lg border border-gold/30 hover:border-gold transition-colors"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Reading Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reader Viewport */}
      <div className="flex-1 bg-charcoal relative overflow-auto flex items-center justify-center p-2 sm:p-4">
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Direct PDF Embed via iframe/object with graceful fallback */}
          <object
            data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            type="application/pdf"
            className="w-full h-full rounded shadow-xl border border-gold/10"
          >
            {/* Fallback Viewport if browser PDF plugin is disabled */}
            <div className="flex flex-col items-center justify-center text-center p-8 bg-navy/95 border border-gold/30 rounded-xl max-w-lg">
              {coverImage && (
                <img
                  src={coverImage}
                  alt={title}
                  className="w-44 h-60 object-cover rounded shadow-gold mb-5 border border-gold/40"
                />
              )}
              <h4 className="font-serif text-lg font-bold text-ivory mb-2">{title}</h4>
              <p className="text-xs text-ivory/70 mb-5 leading-relaxed font-sans">
                You can read this publication directly in full resolution or download the complete high-definition archival edition.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold rounded-lg transition-colors flex items-center gap-2 shadow-gold"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open In New Window</span>
                </a>
                <a
                  href={pdfUrl}
                  download
                  className="px-5 py-2.5 bg-charcoal hover:bg-charcoal-soft text-ivory text-xs font-sans rounded-lg transition-colors border border-gold/30 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-gold" />
                  <span>Download Archive</span>
                </a>
              </div>
            </div>
          </object>
        </div>
      </div>

      {/* Reader Bottom Bar */}
      <div className="bg-navy-950 px-4 py-2 border-t border-gold/15 flex items-center justify-between text-xs text-ivory/60 font-sans">
        <span className="text-[11px] text-muted-light">
          Archival Edition • Alif Friends 12 Literary Society
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gold/70 font-mono">
            Full-Screen: {isFullscreen ? 'Active (Esc to exit)' : 'Available'}
          </span>
        </div>
      </div>
    </div>
  );
};
