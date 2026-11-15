'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right';
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number;
  once?: boolean;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 650,
  threshold = 0.15,
  once = true,
  className = '',
  ...props
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentEl = ref.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, once]);

  // Initial and active transform/opacity styles based on animation type
  const getAnimationStyles = () => {
    const baseTransition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    if (isVisible) {
      return {
        opacity: 1,
        transform: 'none',
        transition: baseTransition,
      };
    }

    let initialTransform = 'translateY(24px)';
    if (animation === 'fade-in') {
      initialTransform = 'none';
    } else if (animation === 'scale-up') {
      initialTransform = 'scale(0.94)';
    } else if (animation === 'slide-left') {
      initialTransform = 'translateX(-32px)';
    } else if (animation === 'slide-right') {
      initialTransform = 'translateX(32px)';
    }

    return {
      opacity: 0,
      transform: initialTransform,
      transition: baseTransition,
      willChange: 'opacity, transform',
    };
  };

  return (
    <div
      ref={ref}
      style={getAnimationStyles()}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

