'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, RefreshCw, AlertCircle } from 'lucide-react';

interface SplashScreenProps {
  appName?: string;
  subtitle?: string;
  accentColor?: string;
  onLoaded?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  appName = 'SHOPPY',
  subtitle = 'Your Smart Shopping Destination',
  accentColor = '#FF6B35',
  onLoaded,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Preparing your shopping experience...');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const progressRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    // Track initialization
    const startTime = Date.now();
    let isCancelled = false;

    // Smooth progress simulation tied to actual browser and resource readiness
    const updateProgress = () => {
      if (isCancelled) return;

      const current = progressRef.current;
      let increment = 0;

      if (current < 35) {
        // Phase 1: Initial core assets & script execution
        increment = Math.random() * 8 + 6;
        setStatusText('Preparing your shopping experience...');
      } else if (current < 75) {
        // Phase 2: Loading layout, fonts & database connections
        increment = Math.random() * 6 + 3;
        setStatusText('Connecting to catalog services...');
      } else if (current < 92) {
        // Phase 3: Finalizing user interface
        increment = Math.random() * 4 + 2;
        setStatusText('Finalizing user experience...');
      }

      const next = Math.min(95, current + increment);
      progressRef.current = next;
      setProgress(next);
    };

    intervalRef.current = setInterval(updateProgress, 90);

    // Check actual document and resource readiness
    const checkReadiness = async () => {
      try {
        // Wait for DOM readiness if not already ready
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

        // Wait for document fonts if supported
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

        // Minimum display duration for a smooth, premium feel (at least 800ms)
        const elapsed = Date.now() - startTime;
        if (elapsed < 800) {
          await new Promise((res) => setTimeout(res, 800 - elapsed));
        }

        if (isCancelled) return;

        // Completion: Clear ticker and smoothly jump to 100%
        if (intervalRef.current) clearInterval(intervalRef.current);
        progressRef.current = 100;
        setProgress(100);
        setStatusText('Welcome to SHOPPY!');

        // Wait 320ms at 100% so the user perceives completion
        await new Promise((res) => setTimeout(res, 320));

        if (isCancelled) return;

        // Begin smooth fade-out
        setIsFadingOut(true);
        if (onLoaded) onLoaded();

        // Remove from DOM after CSS transition finishes
        setTimeout(() => {
          if (!isCancelled) {
            setIsVisible(false);
          }
        }, 700);
      } catch (err: any) {
        console.error('Splash screen initialization warning:', err);
        // Fallback: don't block the customer
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        setIsFadingOut(true);
        setTimeout(() => setIsVisible(false), 600);
      }
    };

    // Safety timeout: Maximum 3.2 seconds guarantee so the splash screen NEVER gets stuck
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

  // Handle retry in case of network or critical boot failure
  const handleRetry = () => {
    setHasError(false);
    setProgress(0);
    progressRef.current = 0;
    window.location.reload();
  };

  // Prevent SSR flash / hydration mismatch
  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Application Startup Loading"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#171717] text-white overflow-hidden select-none transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(255, 107, 53, 0.09) 0%, #171717 75%)',
      }}
    >
      {/* Background Ambient Glow Elements */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-40 animate-pulse"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md px-6 text-center">
        {/* Brand Logo & Glowing Icon */}
        <div className="relative mb-6 group">
          {/* Subtle Outer Pulsing Ring */}
          <div
            className="absolute -inset-3 rounded-3xl opacity-35 blur-xl transition-all duration-1000 animate-pulse"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          />

          {/* Logo Container */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-[#262626] to-[#1c1c1c] border border-[#333333] shadow-2xl flex items-center justify-center p-4 transform transition-transform duration-500 hover:scale-105">
            {/* High-end Stylized Shopping Bag & Cart Emblem */}
            <div className="relative flex items-center justify-center">
              <ShoppingBag
                className="w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300"
                style={{
                  color: accentColor,
                  filter: `drop-shadow(0 0 16px ${accentColor}88)`,
                }}
                strokeWidth={2.2}
              />
              {/* Dynamic Sparkle / Accent Tag Dot */}
              <span
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#1c1c1c] animate-ping"
                style={{ backgroundColor: accentColor }}
                aria-hidden="true"
              />
              <span
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#1c1c1c]"
                style={{ backgroundColor: accentColor }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1.5 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-widest text-white font-sans drop-shadow-md">
            {appName.slice(0, -2)}
            <span style={{ color: accentColor }}>{appName.slice(-2)}</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-zinc-400 font-sans">
            {subtitle}
          </p>
        </div>

        {/* Loading Animation & Progress Bar */}
        {!hasError ? (
          <div className="w-64 sm:w-80 space-y-3">
            {/* Horizontal Track & Bar */}
            <div className="w-full h-2 sm:h-2.5 bg-[#262626] rounded-full overflow-hidden border border-[#383838] p-[1.5px] shadow-inner relative">
              <div
                className="h-full rounded-full transition-all duration-150 ease-out relative overflow-hidden"
                style={{
                  width: `${Math.max(4, Math.min(100, progress))}%`,
                  background: `linear-gradient(90deg, #FF6B35 0%, #FF8C42 50%, #FFA05C 100%)`,
                  boxShadow: `0 0 12px ${accentColor}99`,
                }}
              >
                {/* Shimmer animation highlight across the loading bar */}
                <div
                  className="absolute inset-0 w-full h-full opacity-30 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_1.5s_infinite]"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
                    backgroundSize: '200% 100%',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Metrics: Percentage & Status Text */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
              <span className="text-[11px] text-zinc-400 font-sans truncate max-w-[190px]">
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
          /* Graceful Error & Retry Handling */
          <div className="space-y-3 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-center max-w-xs animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage || 'Connection took longer than expected.'}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B35] hover:bg-[#e85a25] text-white text-xs font-sans font-semibold transition-colors shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tap to Retry</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer subtle brand badge */}
      <div className="absolute bottom-6 text-[10px] uppercase font-mono tracking-widest text-zinc-600">
        Premium E-Commerce Platform
      </div>
    </div>
  );
};

