import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Editorial Desk',
  description:
    'Get in touch with the ALIF FRIENDS 12 Editorial & Class Council at Darul Falah Islamic Academy, Taliparamba.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & Editorial Desk | ALIF FRIENDS 12',
    description:
      'Get in touch with the ALIF FRIENDS 12 Editorial & Class Council at Darul Falah Islamic Academy, Taliparamba.',
    url: 'https://aliffriends.vercel.app/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
