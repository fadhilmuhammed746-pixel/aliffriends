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
      className={`relative bg-[#FAF9F5] border border-editorial-border rounded-2xl overflow-hidden shadow-card flex flex-col ${
        isFullscreen ? 'w-screen h-screen rounded-none border-none z-50 fixed inset-0' : 'h-[750px] w-full'
      }`}
    >
      {/* Editorial Reader Toolbar */}
      <div className="bg-forest px-5 py-3.5 border-b border-forest-800 flex flex-wrap items-center justify-between gap-3 text-white z-20">
        <div className="flex items-center gap-3">
          <span className="p-1.5 bg-white/10 text-coral-light rounded-md border border-white/15">
            <BookOpen className="w-4 h-4 text-white" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-sm text-white tracking-wide truncate max-w-xs md:max-w-md">
              {title}
            </h3>
            {editionNumber && (
              <span className="text-[10px] uppercase font-mono tracking-widest text-coral-light">
                {editionNumber} • Archival Reading Suite
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-forest-800 rounded-lg border border-forest-700 px-1 py-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="p-1.5 text-white/80 hover:text-coral transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-white">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 15))}
              className="p-1.5 text-white/80 hover:text-coral transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rotate */}
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 bg-forest-800 text-white/80 hover:text-coral rounded-lg border border-forest-700 transition-colors hidden md:block"
            title="Rotate Page"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Download button */}
          <a
            href={pdfUrl}
            download
            className="px-3.5 py-1.5 bg-coral hover:bg-coral-dark text-white text-xs font-serif font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-coral"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Download PDF</span>
          </a>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-forest-800 text-white hover:text-coral rounded-lg border border-forest-700 transition-colors"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Reading Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reader Viewport */}
      <div className="flex-1 bg-[#EFEFE8] relative overflow-auto flex items-center justify-center p-3 sm:p-6">
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Direct PDF Embed */}
          <object
            data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            type="application/pdf"
            className="w-full h-full rounded-xl shadow-card border border-editorial-border bg-white"
          >
            {/* Fallback Viewport */}
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-editorial-border rounded-xl max-w-lg shadow-card">
              {coverImage && (
                <img
                  src={coverImage}
                  alt={title}
                  className="w-44 h-60 object-cover rounded-lg shadow-subtle mb-5 border border-editorial-border"
                />
              )}
              <h4 className="font-serif text-lg font-bold text-forest mb-2">{title}</h4>
              <p className="text-xs text-ink-muted mb-5 leading-relaxed font-sans">
                You can read this publication directly in full resolution or download the complete high-definition archival edition.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-forest hover:bg-forest-800 text-white text-xs font-serif font-bold rounded-lg transition-colors flex items-center gap-2 shadow-subtle"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open In New Window</span>
                </a>
                <a
                  href={pdfUrl}
                  download
                  className="px-5 py-2.5 bg-white hover:bg-canvas text-forest text-xs font-sans rounded-lg transition-colors border border-editorial-border flex items-center gap-2 font-medium"
                >
                  <Download className="w-4 h-4 text-coral" />
                  <span>Download Archive</span>
                </a>
              </div>
            </div>
          </object>
        </div>
      </div>

      {/* Reader Bottom Bar */}
      <div className="bg-white px-5 py-2.5 border-t border-editorial-border flex items-center justify-between text-xs text-ink-muted font-sans">
        <span className="text-[11px]">
          Archival Edition • Alif Friends 12 Literary Society
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-forest font-mono">
            {isFullscreen ? 'Full Screen Mode (Esc to exit)' : 'Full-Screen Available'}
          </span>
        </div>
      </div>
    </div>
  );
};
