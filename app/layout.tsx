import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { BreakingTicker } from '@/components/navigation/BreakingTicker';
import { PwaProvider, InstallAppModal } from '@/components/pwa';
import { SplashScreen } from '@/components/splash';
import { PageAnalytics } from '@/components/analytics/PageAnalytics';
import { ScrollProgressBar, BackToTop } from '@/components/ui';
import { db } from '@/lib/db';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ALIF FRIENDS 12 | 12th Batch, Darul Falah Islamic Academy',
    template: '%s | ALIF FRIENDS 12',
  },
  description:
    'ALIF FRIENDS 12 – The digital home of the 12th batch of Darul Falah Islamic Academy, Taliparamba, Kannur, Kerala. A Class. A Generation. A Thousand Memories. Preserving our friendship, learning experiences, publications, achievements, and unforgettable memories.',
  keywords: [
    'ALIF FRIENDS 12',
    'Darul Falah Islamic Academy',
    'DFIA',
    'Taliparamba',
    'Kannur',
    'Kerala',
    '12th Batch',
    'Darul Huda Islamic University',
    'DHIU',
    'SAAF Super League',
    'Alif Creations 12',
    'Class Magazine',
  ],
  authors: [{ name: 'ALIF FRIENDS 12 Editorial & Class Council' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ALIF FRIENDS 12',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon.png', sizes: '128x128', type: 'image/png' },
    ],
  },
  verification: {
    google: '_QTASR8F-fJBxpNrUetvnAjdPD89YSO5UgLtsicynMw',
  },
  openGraph: {
    title: 'ALIF FRIENDS 12 — A Class. A Generation. A Thousand Memories.',
    description:
      'The definitive digital publication, magazine archive, newsroom, and cinematic media platform of Alif Friends 12.',
    siteName: 'ALIF FRIENDS 12',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'ALIF FRIENDS 12 Digital Publication',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#123C32',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await db.getSettings();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${plusJakarta.variable}`}
    >
      <body className="bg-canvas text-ink antialiased min-h-screen flex flex-col justify-between selection:bg-coral selection:text-white">
        <ScrollProgressBar />
        <SplashScreen />
        <Suspense fallback={null}>
          <PageAnalytics />
        </Suspense>
        <PwaProvider>
          <div>
            <BreakingTicker
              text={settings.breakingTickerText}
              show={settings.showBreakingTicker}
            />
            <Navbar />
            <div className="relative">{children}</div>
          </div>
          <Footer />
          <BackToTop />
          <InstallAppModal />
        </PwaProvider>
      </body>
    </html>
  );
}
