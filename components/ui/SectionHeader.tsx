import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowColor?: 'coral' | 'forest' | 'muted';
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
  centered?: boolean;
  divider?: boolean;
  dark?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  eyebrowColor = 'coral',
  title,
  subtitle,
  actionHref,
  actionLabel,
  centered = false,
  divider = true,
  dark = false,
  className = '',
}) => {
  const eyebrowColors = {
    coral: 'text-coral',
    forest: 'text-forest',
    muted: dark ? 'text-canvas-muted' : 'text-ink-muted',
  }[eyebrowColor];

  return (
    <div
      className={`mb-10 sm:mb-14 ${
        divider
          ? dark
            ? 'border-b border-forest-800 pb-6 sm:pb-8'
            : 'border-b border-editorial-border pb-6 sm:pb-8'
          : ''
      } ${className}`}
    >
      <div
        className={`flex flex-col ${
          centered
            ? 'items-center text-center'
            : 'sm:flex-row sm:items-end justify-between gap-4'
        }`}
      >
        <div className={`space-y-2 ${centered ? 'max-w-2xl' : 'max-w-3xl'}`}>
          {eyebrow && (
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${eyebrowColor === 'coral' ? 'bg-coral' : 'bg-forest'}`} />
              <span
                className={`text-[11px] sm:text-xs font-mono font-bold uppercase tracking-tag ${eyebrowColors}`}
              >
                {eyebrow}
              </span>
            </div>
          )}

          <h2
            className={`font-serif font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.08] ${
              dark ? 'text-white' : 'text-forest'
            }`}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className={`font-sans text-sm sm:text-base leading-relaxed pt-1 ${
                dark ? 'text-canvas-warm/80' : 'text-ink-muted'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {actionHref && actionLabel && !centered && (
          <Link
            href={actionHref}
            className={`inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-widest transition-all duration-200 group flex-shrink-0 self-start sm:self-end pb-1 ${
              dark
                ? 'text-coral-light hover:text-white'
                : 'text-forest hover:text-coral'
            }`}
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-coral transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
};

