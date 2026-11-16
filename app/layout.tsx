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
  metadataBase: new URL('https://aliffriends.vercel.app'),
  title: {
    default: 'ALIF FRIENDS 12 | Official Website – Darul Falah Islamic Academy',
    template: '%s | ALIF FRIENDS 12',
  },
  description:
    'Official website of ALIF FRIENDS 12, the 12th batch of Darul Falah Islamic Academy, Taliparamba. Preserving our digital magazine archive, student newspaper reports, cultural programs, cinematic video broadcasts, achievements, and batch memory gallery.',
  keywords: [
    'ALIF FRIENDS 12',
    'Alif Friends 12',
    'ALIF FRIENDS',
    'Darul Falah Islamic Academy',
    'DFIA 12th Batch',
    'Taliparamba',
    'Kannur',
    'Kerala',
    'Darul Huda Islamic University',
    'DHIU',
    'SAAF Super League',
    'Alif Creations 12',
    'Khavarikhul Adaath',
    'Class Magazine Archive',
  ],
  authors: [{ name: 'ALIF FRIENDS 12 Editorial & Class Council' }],
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
    title: 'ALIF FRIENDS 12 | Official Website – Darul Falah Islamic Academy',
    description:
      'Official website of ALIF FRIENDS 12, the 12th batch of Darul Falah Islamic Academy, Taliparamba. Preserving our digital magazine archive, student newspaper reports, cultural programs, cinematic video broadcasts, achievements, and batch memory gallery.',
    url: 'https://aliffriends.vercel.app',
    siteName: 'ALIF FRIENDS 12',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'ALIF FRIENDS 12 – Darul Falah Islamic Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALIF FRIENDS 12 | Official Website – Darul Falah Islamic Academy',
    description:
      'Official website of ALIF FRIENDS 12, the 12th batch of Darul Falah Islamic Academy, Taliparamba. Preserving our digital magazine archive, student newspaper reports, cultural programs, cinematic video broadcasts, achievements, and batch memory gallery.',
    images: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://aliffriends.vercel.app/#website',
                  url: 'https://aliffriends.vercel.app/',
                  name: 'ALIF FRIENDS 12',
                  alternateName: ['Alif Friends 12', 'Alif Friends', 'ALIF FRIENDS XII', 'AF12'],
                  description:
                    'Official digital website, publication archive, newsroom, and community hub of ALIF FRIENDS 12, the 12th batch of Darul Falah Islamic Academy.',
                  inLanguage: 'en-US',
                  publisher: {
                    '@id': 'https://aliffriends.vercel.app/#organization',
                  },
                },
                {
                  '@type': 'EducationalOrganization',
                  '@id': 'https://aliffriends.vercel.app/#organization',
                  name: 'ALIF FRIENDS 12',
                  alternateName: 'Alif Friends 12 Batch Community',
                  url: 'https://aliffriends.vercel.app/',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://aliffriends.vercel.app/logo-emblem.png',
                    caption: 'ALIF FRIENDS 12 Calligraphic Emblem',
                  },
                  description:
                    'ALIF FRIENDS 12 is the student fellowship and alumni community of the 12th batch of Darul Falah Islamic Academy (DFIA), Taliparamba, Kannur, Kerala. A digital archive preserving publications, magazines, articles, achievements, cultural programs, and student memories.',
                  email: 'aliffriends12@gmail.com',
                  sameAs: [
                    'https://www.youtube.com/@AlifCreations12',
                    'https://www.instagram.com/_alif_friends_/',
                  ],
                  foundingLocation: {
                    '@type': 'Place',
                    name: 'Darul Falah Islamic Academy, Taliparamba, Kannur, Kerala, India',
                  },
                  parentOrganization: {
                    '@type': 'EducationalOrganization',
                    name: 'Darul Falah Islamic Academy',
                    url: 'https://darulfalah.in/',
                  },
                },
              ],
            }),
          }}
        />
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
