import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  taglineText?: string;
  clickable?: boolean;
  useFullGraphic?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  taglineText = '12TH BATCH, DARUL FALAH ISLAMIC ACADEMY',
  clickable = true,
  useFullGraphic = false,
}) => {
  const isLight = variant === 'light'; // Light text for forest/dark backgrounds
  const titleColor = isLight ? 'text-canvas' : 'text-forest';
  const taglineColor = isLight ? 'text-canvas/75' : 'text-ink-muted';

  // Sizing definitions
  const emblemHeight =
    size === 'sm' ? 36 : size === 'md' ? 46 : size === 'lg' ? 58 : 74;
  const emblemWidth = Math.round(emblemHeight * (520 / 796));

  const titleSize =
    size === 'sm'
      ? 'text-sm sm:text-base tracking-wider'
      : size === 'md'
      ? 'text-lg sm:text-xl tracking-wider'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl tracking-widest'
      : 'text-3xl sm:text-4xl tracking-ultra';

  const subtitleSize =
    size === 'sm'
      ? 'text-[9px] tracking-wider'
      : size === 'md'
      ? 'text-[10px] sm:text-[11px] tracking-widest'
      : 'text-xs tracking-widest';

  // If full graphic mode requested, display the full official badge image
  if (useFullGraphic) {
    const graphicContent = (
      <div className="inline-flex items-center justify-center group transition-transform duration-300 hover:scale-[1.02]">
        <div className="relative" style={{ height: emblemHeight * 2, width: (emblemHeight * 2) * (520 / 966) }}>
          <Image
            src="/logo.png"
            alt="Alif Friends 12 - 12th Batch, Darul Falah Islamic Academy"
            fill
            sizes="300px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    );

    if (!clickable) return graphicContent;

    return (
      <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-md">
        {graphicContent}
      </Link>
    );
  }

  const content = (
    <div className="flex items-center gap-3 sm:gap-3.5 group cursor-pointer transition-all duration-300">
      {/* Official Arabic Calligraphic Emblem */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
        style={{
          width: emblemWidth + 8,
          height: emblemHeight + 4,
        }}
      >
        <Image
          src="/logo-emblem.png"
          alt="Alif Friends 12 Calligraphic Emblem"
          width={emblemWidth}
          height={emblemHeight}
          className="object-contain drop-shadow-sm filter transition-all duration-300 group-hover:drop-shadow-md"
          priority
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-2">
          <span className={`font-serif font-black ${titleColor} ${titleSize} leading-none tracking-widest transition-colors`}>
            ALIF FRIENDS
          </span>
          <span className="font-serif font-black text-white text-[11px] sm:text-xs bg-coral px-1.5 py-0.5 rounded leading-none shadow-sm flex-shrink-0">
            12
          </span>
        </div>
        {showTagline && (
          <span className={`font-sans font-semibold uppercase ${subtitleSize} mt-1 ${taglineColor} leading-tight`}>
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );

  if (!clickable) return content;

  return (
    <Link
      href="/"
      className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-md"
    >
      {content}
    </Link>
  );
};
