import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
  size?: 'default' | 'narrow' | 'prose' | 'full';
  id?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
  size = 'default',
  id,
}) => {
  const sizeClasses = {
    default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8',
    prose: 'max-w-prose mx-auto px-4 sm:px-6',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  }[size];

  return (
    <Component id={id} className={`${sizeClasses} ${className}`}>
      {children}
    </Component>
  );
};

