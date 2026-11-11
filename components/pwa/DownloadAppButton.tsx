'use client';

import React from 'react';
import { usePwa } from './PwaContext';
import { Download, Smartphone, Check, Sparkles } from 'lucide-react';
import { trackAppDownloadClick } from '@/lib/analytics';

interface DownloadAppButtonProps {
  variant?: 'header' | 'hero' | 'menu' | 'footer' | 'mobile-bar';
  className?: string;
  label?: string;
}

export const DownloadAppButton: React.FC<DownloadAppButtonProps> = ({
  variant = 'header',
  className = '',
  label,
}) => {
  const { openInstallModal, isInstalled } = usePwa();

  const handleAction = () => {
    trackAppDownloadClick(variant === 'mobile-bar' ? 'header' : variant);
    openInstallModal();
  };

  // Variant: Desktop Header
  if (variant === 'header') {
    return (
      <button
        type="button"
        onClick={handleAction}
        className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-serif font-bold uppercase tracking-tag transition-all duration-300 border shadow-subtle ${
          isInstalled
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : 'bg-coral hover:bg-coral-600 text-white border-coral-dark hover:shadow-md active:scale-95'
        } ${className}`}
        aria-label="Download ALIF FRIENDS 12 Application"
        title={isInstalled ? 'App Installed on this device' : 'Download and install ALIF FRIENDS 12 app'}
      >
        {isInstalled ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-700" />
            <span>App Installed</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            <span>{label || 'Download App'}</span>
          </>
        )}
      </button>
    );
  }

  // Variant: Homepage Hero Section
  if (variant === 'hero') {
    return (
      <button
        type="button"
        onClick={handleAction}
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-serif font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 border shadow-md active:scale-[0.98] ${
          isInstalled
            ? 'bg-white/15 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm'
            : 'bg-white/10 hover:bg-white/20 text-white hover:text-coral-light border-white/30 hover:border-coral-light/60 backdrop-blur-sm'
        } ${className}`}
        aria-label="Download ALIF FRIENDS 12 Application"
      >
        {isInstalled ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>App Installed</span>
          </>
        ) : (
          <>
            <Smartphone className="w-4 h-4 text-coral-light" />
            <span>{label || 'Download App'}</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-coral animate-ping" />
          </>
        )}
      </button>
    );
  }

  // Variant: Mobile Hamburger Navigation Menu
  if (variant === 'menu') {
    return (
      <button
        type="button"
        onClick={handleAction}
        className={`w-full p-3.5 rounded-xl text-left transition-all duration-200 border flex items-center justify-between group ${
          isInstalled
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-forest text-white border-forest-800 hover:bg-forest-800 shadow-md'
        } ${className}`}
        aria-label="Download and install ALIF FRIENDS 12 app"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isInstalled ? 'bg-emerald-200 text-emerald-800' : 'bg-coral text-white'
            }`}
          >
            {isInstalled ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm tracking-wide">
                {isInstalled ? 'ALIF FRIENDS 12 App' : 'Download ALIF 12 App'}
              </span>
              {!isInstalled && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-coral text-white font-bold">
                  FREE
                </span>
              )}
            </div>
            <p className="text-[11px] font-sans opacity-80 line-clamp-1">
              {isInstalled
                ? 'Installed on this device with offline access'
                : 'Install for phone, tablet & desktop'}
            </p>
          </div>
        </div>

        <div className="pl-2">
          <span
            className={`text-[10px] font-serif font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
              isInstalled
                ? 'bg-white border-emerald-300 text-emerald-800'
                : 'bg-white/10 border-white/20 text-white group-hover:bg-coral group-hover:border-coral'
            }`}
          >
            {isInstalled ? 'Installed' : 'Install'}
          </span>
        </div>
      </button>
    );
  }

  // Variant: Website Footer
  if (variant === 'footer') {
    return (
      <button
        type="button"
        onClick={handleAction}
        className={`px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-700 text-xs font-serif uppercase tracking-wider font-semibold text-white flex items-center gap-2.5 transition-all group shadow-subtle ${className}`}
        aria-label="Install ALIF FRIENDS 12 Web Application"
      >
        {isInstalled ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>App Installed</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
            <span>{label || 'Download App'}</span>
            <span className="text-[10px] text-coral-light font-mono lowercase">.pwa</span>
          </>
        )}
      </button>
    );
  }

  // Variant: Mobile top bar icon/pill
  return (
    <button
      type="button"
      onClick={handleAction}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider transition-colors border shadow-xs ${
        isInstalled
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-coral text-white border-coral hover:bg-coral-600'
      } ${className}`}
    >
      <Download className="w-3 h-3" />
      <span>{label || 'App'}</span>
    </button>
  );
};

