import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { BreakingTicker } from '@/components/navigation/BreakingTicker';
import { PwaProvider, InstallAppModal } from '@/components/pwa';
import { db } from '@/lib/db';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'ALIF FRIENDS 12 | The International Digital Publication',
    template: '%s | ALIF FRIENDS 12',
  },
  description:
    'A Class. A Generation. A Thousand Memories. The definitive digital publication, magazine archive, newsroom, and cinematic media platform of Alif Friends 12.',
  keywords: [
    'Alif Friends 12',
    'AF12',
    'Editorial Publication',
    'Digital Magazine',
    'International Newsroom',
    'Class Heritage',
    'Alif Creations 12',
  ],
  authors: [{ name: 'Alif Friends 12 Editorial Directorate' }],
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
          <InstallAppModal />
        </PwaProvider>
      </body>
    </html>
  );
}
