import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { BreakingTicker } from '@/components/navigation/BreakingTicker';
import { db } from '@/lib/db';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '600', '700', '900'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'ALIF FRIENDS 12 | Digital Publication & Media Platform',
    template: '%s | ALIF FRIENDS 12',
  },
  description:
    'A Class. A Generation. A Thousand Memories. The official digital publication, magazine archive, newspaper, and cinematic media platform of Alif Friends 12.',
  keywords: [
    'Alif Friends 12',
    'AF12',
    'Class Publication',
    'Digital Magazine',
    'Class Newspaper',
    'Alif Creations 12',
    'Class Heritage',
  ],
  authors: [{ name: 'Alif Friends 12 Editorial Board' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'ALIF FRIENDS 12 — A Class. A Generation. A Thousand Memories.',
    description:
      'The premier digital publication, magazine archive, and cinematic media center of Alif Friends 12.',
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
  themeColor: '#101827',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = db.getSettings();

  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${plusJakarta.variable}`}
    >
      <body className="bg-navy text-ivory antialiased min-h-screen flex flex-col justify-between selection:bg-gold selection:text-navy">
        <div>
          <BreakingTicker
            text={settings.breakingTickerText}
            show={settings.showBreakingTicker}
          />
          <Navbar />
          <div className="relative">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
