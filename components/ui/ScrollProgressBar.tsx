'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const ScrollProgressBar: React.FC = () => {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setScrollProgress(progress);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-forest via-emerald-600 to-coral transition-all duration-150 ease-out relative shadow-[0_0_8px_rgba(230,107,78,0.6)]"
        style={{ width: `${scrollProgress}%` }}
      >
        {scrollProgress > 0 && scrollProgress < 100 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-coral-light blur-[1px] shadow-[0_0_6px_#E66B4E]" />
        )}
      </div>
    </div>
  );
};
