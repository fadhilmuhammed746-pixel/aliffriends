import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'coral' | 'forest' | 'muted' | 'dark' | 'success' | 'draft' | 'urgent';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'forest',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
  }[size];

  const variantClasses = {
    coral: 'bg-coral/10 text-coral border border-coral/20 font-bold',
    urgent: 'bg-coral text-white font-bold shadow-sm',
    forest: 'bg-forest-50 text-forest border border-forest-100 font-semibold',
    muted: 'bg-canvas-muted text-ink-muted border border-editorial-border font-medium',
    dark: 'bg-white/10 text-canvas-warm border border-white/20 backdrop-blur-sm font-semibold',
    success: 'bg-forest/10 text-forest border border-forest/20 font-bold',
    draft: 'bg-ink-muted/15 text-ink-muted border border-ink-muted/30 font-bold',
  }[variant];

  return (
    <span
      className={`inline-flex items-center uppercase tracking-tag font-mono rounded-full leading-none select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

