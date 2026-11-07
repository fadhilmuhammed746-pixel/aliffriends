import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'coral' | 'forest' | 'ghost' | 'ghost-light' | 'link';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'forest',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-serif font-bold uppercase tracking-widest transition-all duration-300 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeClasses = {
    sm: 'text-[11px] px-3.5 py-2 gap-1.5',
    md: 'text-xs px-5 py-2.5 sm:py-3 gap-2',
    lg: 'text-xs sm:text-sm px-7 py-3.5 sm:py-4 gap-2.5',
  }[size];

  const variantClasses = {
    coral:
      'bg-coral hover:bg-coral-dark text-white shadow-subtle hover:shadow-coral',
    forest:
      'bg-forest hover:bg-forest-800 text-white shadow-subtle hover:shadow-editorial',
    ghost:
      'bg-white hover:bg-canvas-warm text-forest border border-editorial-border hover:border-forest/40 shadow-subtle',
    'ghost-light':
      'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-sm',
    link:
      'bg-transparent text-forest hover:text-coral p-0 tracking-widest underline underline-offset-4 shadow-none hover:shadow-none',
  }[variant];

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
        target={props.target}
        rel={props.rel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

