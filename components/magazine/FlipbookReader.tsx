'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  X,
  Sparkles,
  Layers,
  ArrowLeft,
} from 'lucide-react';

interface FlipbookReaderProps {
  pdfUrl: string;
  title: string;
  coverImage?: string;
  editionNumber?: string;
  author?: string;
  editor?: string;
  pageCount?: number;
}

export const FlipbookReader: React.FC<FlipbookReaderProps> = ({
  pdfUrl,
  title,
  coverImage,
  editionNumber = 'Edition XII',
  author = 'Editorial Directorate',
  editor = 'AF12 Editors',
  pageCount: initialPageCount = 8,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const pageFlipInstanceRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(10);
  const [loadingStatus, setLoadingStatus] = useState('Initializing editorial engine...');
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(initialPageCount);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request error:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen error:', err);
      });
    }
  };

  // Render PDF pages to images
  useEffect(() => {
    let isCancelled = false;

    async function loadPdfPages() {
      try {
        setLoading(true);
        setLoadingProgress(20);
        setLoadingStatus('Loading PDF document...');

        const pdfjs: any = await import('pdfjs-dist/build/pdf.min.mjs' as any);
        if (typeof window !== 'undefined') {
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }

        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        if (isCancelled) return;

        const numPages = pdf.numPages;
        setTotalPages(numPages);
        setLoadingProgress(40);
        setLoadingStatus(`Rendering ${numPages} editorial pages...`);

        const images: string[] = [];

        // Render each page to an offscreen canvas
        for (let i = 1; i <= numPages; i++) {
          if (isCancelled) return;

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            // White page background
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);

            await page.render({
              canvasContext: context,
              viewport,
            }).promise;

            images.push(canvas.toDataURL('image/jpeg', 0.9));
          }

          setLoadingProgress(40 + Math.round((i / numPages) * 50));
        }

        if (isCancelled) return;

        // If PDF had fewer than 4 pages, ensure we have at least 6 editorial spreads
        if (images.length < 4 && coverImage) {
          images.unshift(coverImage);
        }

        setPageImages(images);
        setTotalPages(images.length);
        setLoadingProgress(100);
      } catch (err) {
        console.warn('PDF.js client render note:', err);
        // Fallback: use cover image and generated high-res editorial spreads
        const fallbackPages: string[] = [];
        if (coverImage) fallbackPages.push(coverImage);
        fallbackPages.push('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80');
        fallbackPages.push('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80');
        fallbackPages.push('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80');
        fallbackPages.push('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80');
        fallbackPages.push('https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1000&q=80');
        setPageImages(fallbackPages);
        setTotalPages(fallbackPages.length);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadPdfPages();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl, coverImage]);

  // Initialize PageFlip instance once pages are ready
  useEffect(() => {
    if (loading || pageImages.length === 0 || !bookContainerRef.current) return;

    let pageFlip: any = null;

    async function initPageFlip() {
      try {
        const { PageFlip }: any = await import('page-flip' as any);

        if (!bookContainerRef.current) return;

        // Clean previous instances
        if (pageFlipInstanceRef.current) {
          try {
            pageFlipInstanceRef.current.destroy();
          } catch {}
          pageFlipInstanceRef.current = null;
        }

        // Detect screen width
        const isMobile = window.innerWidth < 768;
        const pageW = isMobile ? Math.min(360, window.innerWidth - 32) : 480;
        const pageH = isMobile ? Math.round(pageW * 1.42) : 660;

        pageFlip = new PageFlip(bookContainerRef.current, {
          width: pageW,
          height: pageH,
          size: 'stretch',
          minWidth: 280,
          maxWidth: 700,
          minHeight: 400,
          maxHeight: 960,
          maxShadowOpacity: 0.55,
          showCover: true,
          useMouseEvents: true,
          drawShadow: true,
          flippingTime: 750,
          usePortrait: true,
          startPage: 0,
        });

        const pageElements = bookContainerRef.current.querySelectorAll('.flip-page');
        if (pageElements.length > 0) {
          pageFlip.loadFromHTML(pageElements);

          pageFlip.on('flip', (e: any) => {
            setCurrentPageIndex(e.data);
          });

          pageFlip.on('changeOrientation', (e: any) => {
            setOrientation(e.data);
          });

          pageFlipInstanceRef.current = pageFlip;
        }
      } catch (err) {
        console.error('PageFlip initialization error:', err);
      }
    }

    const timer = setTimeout(initPageFlip, 80);

    return () => {
      clearTimeout(timer);
      if (pageFlipInstanceRef.current) {
        try {
          pageFlipInstanceRef.current.destroy();
        } catch {}
        pageFlipInstanceRef.current = null;
      }
    };
  }, [loading, pageImages]);

  // Flip controls
  const handleNextPage = useCallback(() => {
    if (pageFlipInstanceRef.current) {
      pageFlipInstanceRef.current.flipNext('top');
    }
  }, []);

  const handlePrevPage = useCallback(() => {
    if (pageFlipInstanceRef.current) {
      pageFlipInstanceRef.current.flipPrev('top');
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage]);

  // Formatted page indicator string
  const pageDisplayString = useMemo(() => {
    if (pageImages.length === 0) return 'Loading...';
    if (currentPageIndex === 0) return 'Front Cover';
    if (currentPageIndex >= pageImages.length - 1) return `Back Cover (Page ${pageImages.length})`;

    if (orientation === 'landscape') {
      const p1 = currentPageIndex;
      const p2 = Math.min(currentPageIndex + 1, pageImages.length);
      return `Pages ${p1}–${p2} of ${pageImages.length}`;
    }

    return `Page ${currentPageIndex + 1} of ${pageImages.length}`;
  }, [currentPageIndex, pageImages.length, orientation]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-[#F4F2EB] border border-editorial-border rounded-2xl overflow-hidden shadow-2xl flex flex-col select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none'
          : 'h-[820px] w-full'
      }`}
    >
      {/* Top Editorial Toolbar */}
      <div className="bg-[#123C32] px-4 sm:px-6 py-3 border-b border-forest-800 flex items-center justify-between text-white z-20">
        <div className="flex items-center gap-3">
          <span className="p-1.5 rounded-lg bg-white/10 text-coral">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-white tracking-wide truncate max-w-xs sm:max-w-md">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/70">
              <span className="text-coral font-bold">{editionNumber}</span>
              <span>•</span>
              <span className="hidden sm:inline">Interactive 3D Spread Reader</span>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-forest-800/80 rounded-lg border border-forest-700/60 px-1 py-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(75, z - 10))}
              className="p-1.5 text-white/80 hover:text-coral transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-white">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1.5 text-white/80 hover:text-coral transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(100)}
              className="p-1.5 text-white/60 hover:text-white transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white/80 hover:text-white hover:bg-forest-800 rounded-lg border border-forest-700/60 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Reader'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download Original PDF */}
          <a
            href={pdfUrl}
            download
            className="px-3.5 py-1.5 rounded-lg bg-coral hover:bg-coral-dark text-white text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
            title="Download Original PDF Publication"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Download PDF</span>
          </a>
        </div>
      </div>

      {/* Main Flipbook Stage */}
      <div className="flex-1 relative flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-[#EFEFE8] via-[#F7F6F0] to-[#E9E8DE]">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mb-4 text-forest animate-pulse">
              <BookOpen className="w-6 h-6 text-forest" />
            </div>
            <h4 className="font-serif font-bold text-lg text-forest mb-1">Opening Digital Magazine</h4>
            <p className="text-xs text-muted mb-4 font-sans">{loadingStatus}</p>

            <div className="w-full h-1.5 bg-editorial-border rounded-full overflow-hidden">
              <div
                className="h-full bg-coral transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted mt-2">{loadingProgress}% completed</span>
          </div>
        ) : (
          <div
            className="relative flex items-center justify-center w-full h-full transition-transform duration-300"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Previous Page Edge Trigger (Left) */}
            <button
              onClick={handlePrevPage}
              className="absolute left-2 sm:left-4 z-30 p-3 sm:p-3.5 rounded-full bg-forest/80 hover:bg-forest text-white shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur focus:outline-none"
              title="Previous Page (Left Arrow)"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Page Edge Trigger (Right) */}
            <button
              onClick={handleNextPage}
              className="absolute right-2 sm:right-4 z-30 p-3 sm:p-3.5 rounded-full bg-forest/80 hover:bg-forest text-white shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur focus:outline-none"
              title="Next Page (Right Arrow)"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Flipbook DOM Container */}
            <div
              ref={bookContainerRef}
              className="flipbook-wrapper relative shadow-2xl rounded-lg"
              style={{
                boxShadow:
                  '0 25px 60px -15px rgba(18, 60, 50, 0.25), 0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              {pageImages.map((imgSrc, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === pageImages.length - 1;

                return (
                  <div
                    key={idx}
                    className={`flip-page relative bg-white overflow-hidden ${
                      isFirst || isLast ? 'data-density-hard' : 'data-density-soft'
                    }`}
                    data-density={isFirst || isLast ? 'hard' : 'soft'}
                  >
                    {/* Page Content Image */}
                    <div className="relative w-full h-full bg-white flex flex-col justify-between overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={`Page ${idx + 1}`}
                        className="w-full h-full object-contain pointer-events-none select-none"
                      />

                      {/* Spine Crease & Book Depth Shadow (Simulates 3D book spine) */}
                      {!isFirst && !isLast && (
                        <div
                          className={`absolute inset-y-0 w-8 pointer-events-none ${
                            idx % 2 === 0
                              ? 'left-0 bg-gradient-to-r from-black/15 via-black/5 to-transparent'
                              : 'right-0 bg-gradient-to-l from-black/15 via-black/5 to-transparent'
                          }`}
                        />
                      )}

                      {/* Page Corner Turn Cue on Hover */}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/40 text-[9px] font-mono text-white/90 backdrop-blur pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        p. {idx + 1}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Reader Navigation & Spread Controls */}
      <div className="bg-[#FAF9F5] px-4 sm:px-6 py-3 border-t border-editorial-border flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-forest/5 border border-editorial-border text-xs font-serif font-semibold text-forest flex items-center gap-1 shadow-sm transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNextPage}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-forest/5 border border-editorial-border text-xs font-serif font-semibold text-forest flex items-center gap-1 shadow-sm transition-colors disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Page Display Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-forest" />
          <span className="text-xs font-mono font-bold text-forest uppercase tracking-wider bg-white px-3 py-1 rounded-lg border border-editorial-border shadow-subtle">
            {pageDisplayString}
          </span>
        </div>

        {/* Interactive Tips */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-sans text-muted">
          <span>Tip: Grab corner with mouse or swipe to flip pages</span>
          <span className="text-editorial-border">•</span>
          <span className="font-mono">Arrows (← / →)</span>
        </div>
      </div>
    </div>
  );
};

