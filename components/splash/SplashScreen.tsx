'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  appName?: string;
  subtitle?: string;
  logoSrc?: string;
  accentColor?: string;
  onLoaded?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  appName = 'ALIF FRIENDS 12',
  subtitle = '12TH BATCH, DARUL FALAH ISLAMIC ACADEMY',
  logoSrc = '/logo.png',
  accentColor = '#E66B4E',
  onLoaded,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing ALIF FRIENDS 12 portal...');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const progressRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    const startTime = Date.now();
    let isCancelled = false;

    // Smooth, progressive status updates tied to boot phases
    const updateProgress = () => {
      if (isCancelled) return;

      const current = progressRef.current;
      let increment = 0;

      if (current < 30) {
        // Phase 1: Core scripts & styles initialization
        increment = Math.random() * 8 + 6;
        setStatusText('Initializing official portal...');
      } else if (current < 70) {
        // Phase 2: Publications, magazines & media services
        increment = Math.random() * 6 + 3;
        setStatusText('Loading archival publications & media...');
      } else if (current < 92) {
        // Phase 3: Finalizing presentation layer
        increment = Math.random() * 4 + 2;
        setStatusText('Preparing reading experience...');
      }

      const next = Math.min(95, current + increment);
      progressRef.current = next;
      setProgress(next);
    };

    intervalRef.current = setInterval(updateProgress, 85);

    // Verify actual DOM and font readiness
    const checkReadiness = async () => {
      try {
        if (document.readyState !== 'complete') {
          await new Promise<void>((resolve) => {
            const onReady = () => {
              if (document.readyState === 'complete') {
                window.removeEventListener('readystatechange', onReady);
                resolve();
              }
            };
            window.addEventListener('readystatechange', onReady);
            window.addEventListener('load', () => resolve(), { once: true });
          });
        }

        // Wait for fonts if supported
        if (document.fonts && document.fonts.ready) {
          try {
            await Promise.race([
              document.fonts.ready,
              new Promise((res) => setTimeout(res, 800)),
            ]);
          } catch {
            // Non-blocking
          }
        }

        // Minimum duration for visual comfort
        const elapsed = Date.now() - startTime;
        if (elapsed < 800) {
          await new Promise((res) => setTimeout(res, 800 - elapsed));
        }

        if (isCancelled) return;

        // Finalize loading at 100%
        if (intervalRef.current) clearInterval(intervalRef.current);
        progressRef.current = 100;
        setProgress(100);
        setStatusText('Welcome to ALIF FRIENDS 12');

        // Short pause at 100% so user perceives completion
        await new Promise((res) => setTimeout(res, 320));

        if (isCancelled) return;

        // Smooth fade-out
        setIsFadingOut(true);
        if (onLoaded) onLoaded();

        // Complete unmount after CSS transition
        setTimeout(() => {
          if (!isCancelled) {
            setIsVisible(false);
          }
        }, 700);
      } catch (err: any) {
        console.error('Splash screen readiness error:', err);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        setIsFadingOut(true);
        setTimeout(() => setIsVisible(false), 500);
      }
    };

    // Safety timeout: Never stay stuck for more than 3.2 seconds
    const safetyTimeout = setTimeout(() => {
      if (progressRef.current < 100 && !isCancelled) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        progressRef.current = 100;
        setProgress(100);
        setIsFadingOut(true);
        setTimeout(() => setIsVisible(false), 500);
      }
    }, 3200);

    checkReadiness();

    return () => {
      isCancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(safetyTimeout);
    };
  }, [onLoaded]);

  const handleRetry = () => {
    setHasError(false);
    setProgress(0);
    progressRef.current = 0;
    window.location.reload();
  };

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="ALIF FRIENDS 12 Startup"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center text-white overflow-hidden select-none transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#0A231D',
        backgroundImage:
          'radial-gradient(ellipse at 50% 35%, rgba(230, 107, 78, 0.12) 0%, rgba(10, 35, 29, 0.98) 75%)',
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full blur-[140px] pointer-events-none opacity-30 animate-pulse"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md px-6 text-center">
        {/* Official ALIF FRIENDS 12 Logo Emblem */}
        <div className="relative mb-6 group">
          {/* Subtle Outer Pulsing Aura */}
          <div
            className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl transition-all duration-1000 animate-pulse"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          />

          {/* Logo Frame */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-[#18453A] to-[#0A231D] border border-emerald-500/30 shadow-2xl flex items-center justify-center p-3 transform transition-transform duration-500 hover:scale-105">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={logoSrc}
                alt="ALIF FRIENDS 12 Official Logo"
                fill
                sizes="128px"
                className="object-contain filter drop-shadow-[0_4px_16px_rgba(230,107,78,0.45)]"
                priority
              />
            </div>
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1.5 mb-7">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-800/80 border border-emerald-500/20 text-[10px] uppercase font-mono tracking-widest text-emerald-300/90 mb-1">
            <Sparkles className="w-3 h-3 text-coral" />
            <span>Official Class Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wider text-canvas drop-shadow-md">
            ALIF FRIENDS <span style={{ color: accentColor }}>12</span>
          </h1>
          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-emerald-200/70">
            {subtitle}
          </p>
        </div>

        {/* Animated Loading Bar */}
        {!hasError ? (
          <div className="w-64 sm:w-80 space-y-2.5">
            {/* Horizontal Track & Bar */}
            <div className="w-full h-2 sm:h-2.5 bg-[#071915] rounded-full overflow-hidden border border-emerald-900/60 p-[1.5px] shadow-inner relative">
              <div
                className="h-full rounded-full transition-all duration-150 ease-out relative overflow-hidden"
                style={{
                  width: `${Math.max(4, Math.min(100, progress))}%`,
                  background: 'linear-gradient(90deg, #E66B4E 0%, #F0876E 50%, #FFB299 100%)',
                  boxShadow: '0 0 14px rgba(230, 107, 78, 0.65)',
                }}
              >
                {/* Shimmer animation */}
                <div
                  className="absolute inset-0 w-full h-full opacity-40 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_1.5s_infinite]"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)',
                    backgroundSize: '200% 100%',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Metrics: Percentage & Status Text */}
            <div className="flex items-center justify-between text-xs font-mono text-emerald-200/60 px-1">
              <span className="text-[11px] font-sans truncate max-w-[200px] text-canvas/80">
                {statusText}
              </span>
              <span
                className="font-bold font-mono text-xs tabular-nums"
                style={{ color: accentColor }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        ) : (
          /* Friendly Retry Option */
          <div className="space-y-3 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-center max-w-xs animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage || 'Connection took longer than expected.'}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-coral hover:bg-coral-dark text-white text-xs font-sans font-semibold transition-colors shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tap to Retry</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer subtle brand badge */}
      <div className="absolute bottom-6 text-[10px] uppercase font-mono tracking-widest text-emerald-400/40">
        The International Digital Publication
      </div>
    </div>
  );
};
