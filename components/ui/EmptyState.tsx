import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  dark?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  dark = false,
}) => {
  return (
    <div
      className={`rounded-2xl border p-12 text-center max-w-xl mx-auto my-12 ${
        dark
          ? 'bg-forest-950/60 border-forest-800 text-canvas'
          : 'bg-white border-editorial-border text-ink'
      }`}
    >
      {icon && (
        <div
          className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${
            dark
              ? 'bg-forest-800 text-coral-light border border-forest-700'
              : 'bg-forest-50 text-coral border border-forest-100'
          }`}
        >
          {icon}
        </div>
      )}
      <h3
        className={`font-serif text-xl sm:text-2xl font-bold tracking-tight mb-2 ${
          dark ? 'text-white' : 'text-forest'
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-xs sm:text-sm max-w-md mx-auto mb-6 ${
          dark ? 'text-canvas-muted' : 'text-ink-muted'
        }`}
      >
        {description}
      </p>
      {actionHref && actionLabel && (
        <Button href={actionHref} variant={dark ? 'ghost-light' : 'forest'} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

