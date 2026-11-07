import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'dark' | 'canvas';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  padding = 'md',
  hoverEffect = false,
  bordered = true,
  className = '',
  ...props
}) => {
  const variantClasses = {
    white: 'bg-white text-ink',
    dark: 'bg-forest-950 text-canvas-warm',
    canvas: 'bg-canvas-warm text-ink',
  }[variant];

  const borderClass = bordered
    ? variant === 'dark'
      ? 'border border-forest-800'
      : 'border border-editorial-border'
    : '';

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8 sm:p-10',
  }[padding];

  const hoverClass = hoverEffect
    ? 'group transition-all duration-300 hover:-translate-y-1 hover:shadow-lift'
    : 'shadow-card';

  return (
    <div
      className={`rounded-xl overflow-hidden ${variantClasses} ${borderClass} ${paddingClasses} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

