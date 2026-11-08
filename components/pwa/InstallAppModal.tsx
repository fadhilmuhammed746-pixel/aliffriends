'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePwa } from './PwaContext';
import {
  Download,
  Smartphone,
  Monitor,
  Share,
  PlusSquare,
  CheckCircle,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  WifiOff,
  Bell,
} from 'lucide-react';

export const InstallAppModal: React.FC = () => {
  const {
    isInstalled,
    canInstallPrompt,
    isIos,
    isAndroid,
    isDesktop,
    isModalOpen,
    verifiedApkUrl,
    closeInstallModal,
    triggerNativeInstall,
  } = usePwa();

  const [installing, setInstalling] = useState(false);

  if (!isModalOpen) return null;

  const handleInstallClick = async () => {
    if (canInstallPrompt) {
      setInstalling(true);
      try {
        await triggerNativeInstall();
      } finally {
        setInstalling(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={closeInstallModal} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-canvas rounded-2xl sm:rounded-3xl border border-editorial-border shadow-2xl overflow-hidden z-10">
        {/* Top Header Banner with Brand Motif */}
        <div className="bg-forest text-white px-6 py-6 sm:px-8 relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute -right-4 -bottom-6 pointer-events-none opacity-10 select-none font-serif font-black text-8xl text-white">
            12
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-forest-900 border border-white/20 p-2 flex items-center justify-center flex-shrink-0 shadow-md">
                <Image
                  src="/logo-emblem.png"
                  alt="ALIF FRIENDS 12 App Icon"
                  width={44}
                  height={54}
                  className="object-contain filter drop-shadow"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide leading-none">
                    ALIF FRIENDS
                  </span>
                  <span className="font-serif font-black text-white text-[10px] bg-coral px-1.5 py-0.5 rounded leading-none">
                    12
                  </span>
                </div>
                <p className="font-sans text-xs text-canvas-muted mt-1">
                  Official Mobile & Desktop Application
                </p>
              </div>
            </div>

            <button
              onClick={closeInstallModal}
              className="p-1.5 rounded-full text-canvas-muted hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Close installation window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Condition 1: Already Installed */}
          {isInstalled ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto shadow-subtle">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3
                  id="pwa-install-title"
                  className="font-serif font-bold text-2xl text-forest"
                >
                  Application Already Installed
                </h3>
                <p className="font-sans text-xs sm:text-sm text-ink-muted max-w-sm mx-auto leading-relaxed">
                  ALIF FRIENDS 12 is active on your device. You can launch it anytime directly from your Home Screen or Applications tray with instant offline access.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeInstallModal}
                  className="w-full py-3 px-6 rounded-xl bg-forest hover:bg-forest-800 text-white font-serif font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
                <div className="p-3 rounded-xl bg-canvas-warm/70 border border-editorial-border space-y-1">
                  <BookOpen className="w-4 h-4 text-coral mx-auto" />
                  <span className="block text-[11px] font-serif font-bold text-forest">
                    3D Flipbook
                  </span>
                  <span className="block text-[9px] font-sans text-ink-muted">
                    Interactive Magazines
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-canvas-warm/70 border border-editorial-border space-y-1">
                  <WifiOff className="w-4 h-4 text-forest mx-auto" />
                  <span className="block text-[11px] font-serif font-bold text-forest">
                    Offline Cache
                  </span>
                  <span className="block text-[9px] font-sans text-ink-muted">
                    Read Anywhere
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-canvas-warm/70 border border-editorial-border space-y-1">
                  <Bell className="w-4 h-4 text-coral mx-auto" />
                  <span className="block text-[11px] font-serif font-bold text-forest">
                    Dispatches
                  </span>
                  <span className="block text-[9px] font-sans text-ink-muted">
                    Breaking Bulletins
                  </span>
                </div>
              </div>

              {/* Platform-Specific Installation Flow */}
              {isIos ? (
                /* iOS Safari Step-by-Step Instructions */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-editorial-border">
                    <Smartphone className="w-4 h-4 text-coral" />
                    <h4
                      id="pwa-install-title"
                      className="font-serif font-bold text-sm text-forest"
                    >
                      Install on iPhone / iPad (Safari)
                    </h4>
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed font-sans">
                    Apple iOS supports Progressive Web Apps directly through Safari without downloading an app store binary:
                  </p>

                  <div className="space-y-2.5 bg-white p-4 rounded-xl border border-editorial-border text-xs text-ink font-sans">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-forest-50 border border-forest-200 text-forest font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        1
                      </span>
                      <span>
                        Tap the <strong className="text-forest">Share</strong> button at the bottom of Safari:
                      </span>
                      <Share className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-forest-50 border border-forest-200 text-forest font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        2
                      </span>
                      <span>
                        Scroll down and tap <strong className="text-forest">Add to Home Screen</strong>:
                      </span>
                      <PlusSquare className="w-4 h-4 text-ink flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-forest-50 border border-forest-200 text-forest font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        3
                      </span>
                      <span>
                        Tap <strong className="text-forest">Add</strong> in the top-right corner.
                      </span>
                    </div>
                  </div>
                </div>
              ) : canInstallPrompt ? (
                /* Native PWA Installation Available (Android / Chrome / Edge) */
                <div className="space-y-4">
                  <div className="text-center space-y-1.5">
                    <h3
                      id="pwa-install-title"
                      className="font-serif font-bold text-xl sm:text-2xl text-forest"
                    >
                      Install ALIF FRIENDS 12
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
                      Add the official web application to your device for fullscreen viewing, zero latency, and one-tap access.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleInstallClick}
                    disabled={installing}
                    className="w-full py-3.5 px-6 rounded-xl bg-coral hover:bg-coral-600 active:scale-[0.99] text-white font-serif font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>{installing ? 'Launching Installer...' : 'Install App Now'}</span>
                  </button>
                </div>
              ) : (
                /* Desktop Browser or Manual Install Instructions */
                <div className="space-y-4">
                  <div className="text-center space-y-1.5">
                    <h3
                      id="pwa-install-title"
                      className="font-serif font-bold text-xl sm:text-2xl text-forest"
                    >
                      Install on Your Device
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
                      {isDesktop
                        ? 'To install on desktop (Chrome, Edge, or Brave), click the install icon (⊕ or desktop monitor) in your browser address bar.'
                        : 'To install on mobile, tap your browser menu (⋮) and select "Add to Home Screen" or "Install App".'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-canvas-warm/80 border border-editorial-border flex items-center gap-3 text-xs text-ink font-sans">
                    <Monitor className="w-5 h-5 text-forest flex-shrink-0" />
                    <div>
                      <strong className="block text-forest font-semibold">Standalone PWA Mode</strong>
                      <span className="text-[11px] text-ink-muted">
                        No app store account required. Consumes &lt;5MB of storage.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Verified Android APK Download (Only rendered if an actual APK URL is configured) */}
              {verifiedApkUrl && (
                <div className="pt-2 border-t border-editorial-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-sans text-ink-muted">
                      Direct Android Package (.apk):
                    </span>
                    <a
                      href={verifiedApkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-forest hover:text-coral transition-colors"
                    >
                      <span>Download Signed APK</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Security & Authenticity Trust Badge */}
              <div className="pt-1 flex items-center justify-center gap-2 text-[10px] font-mono text-ink-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                <span>Verified Official Publication of Alif Friends 12</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

