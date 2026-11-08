'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaContextType {
  isInstalled: boolean;
  canInstallPrompt: boolean;
  isIos: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isModalOpen: boolean;
  verifiedApkUrl: string | null;
  openInstallModal: () => void;
  closeInstallModal: () => void;
  triggerNativeInstall: () => Promise<boolean>;
}

const PwaContext = createContext<PwaContextType>({
  isInstalled: false,
  canInstallPrompt: false,
  isIos: false,
  isAndroid: false,
  isDesktop: false,
  isModalOpen: false,
  verifiedApkUrl: null,
  openInstallModal: () => {},
  closeInstallModal: () => {},
  triggerNativeInstall: async () => false,
});

export const usePwa = () => useContext(PwaContext);

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Optional verified APK URL (only populated if explicitly configured by administrator)
  const verifiedApkUrl = process.env.NEXT_PUBLIC_ANDROID_APK_URL || null;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detect device & OS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    const isAndroidDevice = /android/.test(ua);
    const isDesktopDevice = !isIosDevice && !isAndroidDevice && !/mobile|tablet/.test(ua);

    setIsIos(isIosDevice);
    setIsAndroid(isAndroidDevice);
    setIsDesktop(isDesktopDevice);

    // 2. Detect if already running as installed standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari specific standalone flag
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    // 3. Register service worker for installability criteria
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Check for service worker updates periodically
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update ready
                }
              };
            }
          };
        })
        .catch((err) => {
          console.debug('ServiceWorker registration skipped or failed:', err);
        });
    }

    // 4. Listen for beforeinstallprompt (Chrome, Android, Edge, Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 5. Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const openInstallModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeInstallModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const triggerNativeInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setIsModalOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error triggering native PWA prompt:', error);
      return false;
    }
  }, [deferredPrompt]);

  return (
    <PwaContext.Provider
      value={{
        isInstalled,
        canInstallPrompt: Boolean(deferredPrompt),
        isIos,
        isAndroid,
        isDesktop,
        isModalOpen,
        verifiedApkUrl,
        openInstallModal,
        closeInstallModal,
        triggerNativeInstall,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};

