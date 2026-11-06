import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  clickable?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  clickable = true,
}) => {
  const isLight = variant === 'light'; // Light text for forest/dark green backgrounds
  const isDark = variant === 'dark';   // Dark text for ivory/white backgrounds

  const titleColor = isLight ? 'text-[#F7F6F0]' : 'text-forest';
  const taglineColor = isLight ? 'text-[#F7F6F0]/75' : 'text-ink-muted';

  const iconSize =
    size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 52 : 68;

  const titleSize =
    size === 'sm'
      ? 'text-sm tracking-wider'
      : size === 'md'
      ? 'text-lg sm:text-xl tracking-wider'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl tracking-widest'
      : 'text-3xl sm:text-4xl tracking-ultra';

  const content = (
    <div className="flex items-center gap-3 group cursor-pointer transition-transform duration-300">
      {/* Bespoke AF12 Editorial Emblem in Forest Green with Coral Accent */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden border border-editorial-border shadow-subtle transition-transform duration-300 group-hover:scale-105"
        style={{
          width: iconSize,
          height: iconSize,
          backgroundColor: '#123C32',
        }}
      >
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full p-1.5 transition-transform duration-500 group-hover:rotate-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Inner hairline */}
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            rx="6"
            stroke="#E6E7DF"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          {/* Monogram A */}
          <path
            d="M21 47 L30.5 17 L33.5 17 L43 47 L37.2 47 L35.2 39 L28.8 39 L26.8 47 Z M30.5 33.5 L33.5 33.5 L32 24.5 Z"
            fill="#F7F6F0"
          />
          {/* Accent Coral Point */}
          <circle cx="32" cy="11.5" r="2.5" fill="#E66B4E" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className={`font-serif font-bold ${titleColor} ${titleSize} leading-none tracking-widest`}>
            ALIF FRIENDS
          </span>
          <span className="font-serif font-black text-white text-xs sm:text-sm bg-coral px-1.5 py-0.5 rounded leading-none shadow-sm">
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
    <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded-md">
      {content}
    </Link>
  );
};
