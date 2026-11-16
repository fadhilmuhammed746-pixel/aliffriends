'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const BackToTop: React.FC = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-forest text-white shadow-lift border border-forest-light/40 transition-all duration-300 ease-editorial hover:bg-forest-light hover:scale-110 active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 rounded-full bg-coral/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      <ArrowUp className="w-4 h-4 text-canvas group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
