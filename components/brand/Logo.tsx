import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  clickable?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = true,
  clickable = true,
}) => {
  const isLight = variant === 'light'; // Light text for dark backgrounds (Midnight Navy)
  const isDark = variant === 'dark';   // Dark text for ivory/light backgrounds
  const isGold = variant === 'gold';

  const titleColor = isLight ? 'text-ivory' : isDark ? 'text-navy' : 'text-gold';
  const subColor = isLight ? 'text-gold-light/90' : isDark ? 'text-charcoal/70' : 'text-gold/80';
  const taglineColor = isLight ? 'text-muted-light/75' : isDark ? 'text-muted-dark' : 'text-gold/70';

  const iconSize =
    size === 'sm' ? 32 : size === 'md' ? 42 : size === 'lg' ? 56 : 72;

  const titleSize =
    size === 'sm'
      ? 'text-base tracking-wider'
      : size === 'md'
      ? 'text-xl tracking-widest'
      : size === 'lg'
      ? 'text-2xl tracking-widest'
      : 'text-3xl tracking-ultra';

  const content = (
    <div className="flex items-center gap-3.5 group cursor-pointer transition-transform duration-300">
      {/* Bespoke AF12 Monogram Seal */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-gold border border-gold/40 transition-transform duration-500 group-hover:scale-105"
        style={{ width: iconSize, height: iconSize, backgroundColor: '#101827' }}
      >
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full p-1.5 transition-transform duration-700 group-hover:rotate-3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5DFAB" />
              <stop offset="50%" stopColor="#C8A96B" />
              <stop offset="100%" stopColor="#9A7836" />
            </linearGradient>
          </defs>
          {/* Inner hairline border */}
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="10"
            stroke="url(#logo-gold-grad)"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.8"
          />
          {/* Geometric AF monogram */}
          <path
            d="M21 47 L30.5 17 L33.5 17 L43 47 L37.2 47 L35.2 39.5 L28.8 39.5 L26.8 47 Z M30.2 34.5 L33.8 34.5 L32 25.5 Z"
            fill="url(#logo-gold-grad)"
          />
          {/* 12 Roman accent */}
          <circle cx="32" cy="11.5" r="2" fill="#F5DFAB" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className={`font-serif font-bold ${titleColor} ${titleSize} leading-none tracking-widest`}>
            ALIF FRIENDS
          </span>
          <span className="font-serif font-black text-gold text-lg md:text-xl border border-gold/40 px-1.5 py-0.5 rounded leading-none bg-gold/10">
            12
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] md:text-[11px] uppercase font-sans tracking-widest mt-1 font-medium ${taglineColor}`}>
            A Class. A Generation. A Thousand Memories.
          </span>
        )}
      </div>
    </div>
  );

  if (!clickable) return content;

  return (
    <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg">
      {content}
    </Link>
  );
};
