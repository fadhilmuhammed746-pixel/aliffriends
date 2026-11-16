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
import { trackMagazineView } from '@/lib/analytics';

interface FlipbookReaderProps {
  magazineId?: string;
  downloadUrl?: string;
  pdfUrl: string;
  title: string;
  coverImage?: string;
  editionNumber?: string;
  author?: string;
  editor?: string;
  pageCount?: number;
}

export const FlipbookReader: React.FC<FlipbookReaderProps> = ({
  magazineId,
  downloadUrl,
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
  const [errorMessage, setErrorMessage] = useState('');
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(initialPageCount);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');

  // Track magazine view
  useEffect(() => {
    trackMagazineView(editionNumber, title);
  }, [editionNumber, title]);

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
        setErrorMessage('');
        setLoadingProgress(15);
        setLoadingStatus('Initializing PDF rendering engine...');

        // 1. Polyfill Uint8Array.prototype.toHex if not present
        if (typeof Uint8Array !== 'undefined' && !(Uint8Array.prototype as any).toHex) {
          (Uint8Array.prototype as any).toHex = function () {
            return Array.from(this, (b: any) => b.toString(16).padStart(2, '0')).join('');
          };
        }

        const pdfjs: any = await import('pdfjs-dist/build/pdf.min.mjs' as any);
        if (typeof window !== 'undefined') {
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }

        // 2. Resolve PDF document URL with intelligent fallbacks
        let resolvedUrl = pdfUrl;
        if (!resolvedUrl.startsWith('http://') && !resolvedUrl.startsWith('https://')) {
          resolvedUrl = resolvedUrl.startsWith('/') ? resolvedUrl : `/${resolvedUrl}`;
        }

        const candidateUrls = [
          resolvedUrl,
          downloadUrl,
          magazineId ? `/api/magazines/${magazineId}/download` : null,
          '/magazines/khavarikhul-adaath-official.pdf',
          'https://rdcztjtcticvybauejhk.supabase.co/storage/v1/object/public/af12-media/magazines/khavarikhul_adaath_official.pdf',
          '/uploads/khavarikhul-adaath-edition-1.pdf',
          '/sample-magazine-af12.pdf',
        ].filter(Boolean) as string[];

        // 3. Fetch PDF buffer via resilient fetch
        let arrayBuffer: ArrayBuffer | null = null;
        for (const tryUrl of candidateUrls) {
          if (isCancelled) return;
          try {
            setLoadingStatus(`Fetching publication pages...`);
            const res = await fetch(tryUrl);
            if (res.ok) {
              const buf = await res.arrayBuffer();
              if (buf && buf.byteLength > 1000) {
                arrayBuffer = buf;
                break;
              }
            }
          } catch (fetchErr) {
            console.warn(`Fetch candidate '${tryUrl}' failed:`, fetchErr);
          }
        }

        // 4. Load PDF with PDF.js
        const loadingTask = arrayBuffer
          ? pdfjs.getDocument({
            data: new Uint8Array(arrayBuffer),
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/cmaps/',
            cMapPacked: true,
          })
          : pdfjs.getDocument({
            url: resolvedUrl,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/cmaps/',
            cMapPacked: true,
          });

        const pdf = await loadingTask.promise;

        if (isCancelled) return;

        const numPages = pdf.numPages;
        setTotalPages(numPages);
        setLoadingProgress(35);
        setLoadingStatus(`Rendering ${numPages} publication pages...`);

        const images: string[] = [];

        // 5. Render pages with crisp DPI and memory-safe resolution
        for (let i = 1; i <= numPages; i++) {
          if (isCancelled) return;

          try {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.25 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            if (context) {
              context.fillStyle = '#FFFFFF';
              context.fillRect(0, 0, canvas.width, canvas.height);

              await page.render({
                canvasContext: context,
                viewport,
              }).promise;

              images.push(canvas.toDataURL('image/jpeg', 0.85));
            }
          } catch (renderErr) {
            console.warn(`Render notice for page ${i}:`, renderErr);
            if (i === 1 && coverImage) {
              images.push(coverImage);
            }
          }

          setLoadingProgress(35 + Math.round((i / numPages) * 60));
        }

        if (isCancelled) return;

        if (images.length === 0) {
          throw new Error('No pages could be rendered from the PDF publication.');
        }

        setPageImages(images);
        setTotalPages(images.length);
        setLoadingProgress(100);
      } catch (err: any) {
        console.error('PDF render error:', err);
        setErrorMessage(
          err?.message || 'Could not load interactive flipbook viewer. The publication is available for direct reading or download.'
        );
        // Only use the real cover if available, NEVER stock photos
        if (coverImage) {
          setPageImages([coverImage]);
          setTotalPages(1);
        }
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
  }, [pdfUrl, downloadUrl, magazineId, coverImage]);

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
          } catch { }
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
        } catch { }
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
      className={`relative bg-canvas-warm border border-editorial-border rounded-2xl overflow-hidden shadow-2xl flex flex-col select-none ${isFullscreen
        ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none'
        : 'h-[820px] w-full'
        }`}
    >
      {/* Top Editorial Toolbar */}
      <div className="bg-forest px-4 sm:px-6 py-3 border-b border-forest-800 flex items-center justify-between text-white z-20">
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
            href={downloadUrl || (magazineId ? `/api/magazines/${magazineId}/download` : pdfUrl)}
            download={`${title}.pdf`}
            className="px-3.5 py-1.5 rounded-lg bg-coral hover:bg-coral-dark text-white text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
            title="Download Original PDF Publication"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Download PDF</span>
          </a>
        </div>
      </div>

      {/* Main Flipbook Stage */}
      <div className="flex-1 relative flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-canvas-muted via-canvas to-canvas-dark">
        {errorMessage && pageImages.length <= 1 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md bg-white rounded-2xl border border-editorial-border shadow-lg space-y-4 m-4">
            <div className="w-14 h-14 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-forest mb-1">{title}</h4>
              <p className="text-xs text-ink-muted leading-relaxed font-sans">{errorMessage}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={downloadUrl || (magazineId ? `/api/magazines/${magazineId}/download` : pdfUrl)}
                download={`${title}.pdf`}
                className="px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Read / Download Original PDF</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setLoading(true);
                }}
                className="px-4 py-2 bg-canvas hover:bg-canvas-subtle border border-editorial-border text-forest rounded-lg text-xs font-semibold transition-colors"
              >
                Retry Viewer
              </button>
            </div>
          </div>
        ) : loading ? (
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
                    className={`flip-page relative bg-white overflow-hidden ${isFirst || isLast ? 'data-density-hard' : 'data-density-soft'
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
                          className={`absolute inset-y-0 w-8 pointer-events-none ${idx % 2 === 0
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
      <div className="bg-canvas-warm px-4 sm:px-6 py-3 border-t border-editorial-border flex flex-wrap items-center justify-between gap-3 z-20">
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

