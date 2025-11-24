import React, { type ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  variant?: 'sectionTitle' | 'title' | 'subtitle' | 'body' | 'muted' | 'small' | 'label';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
}

export function Text({ children, as = 'p', variant = 'body', size = 'md', className = '', id }: TextProps) {
  const el = as;

  const variantMap: Record<string, string> = {
    sectionTitle: 'font-bold',
    title: 'font-bold',
    subtitle: 'text-gray-300',
    body: 'text-gray-300 leading-relaxed',
    muted: 'text-gray-400',
    small: 'text-gray-300',
    label: 'font-semibold text-gray-300',
  };

  const sizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  const classes = [variantMap[variant] || '', sizeMap[size] || '', className].join(' ').trim();

  // eslint-disable-next-line react/jsx-pascal-case
  const Component: any = el;
  return <Component id={id} className={classes}>{children}</Component>;
}
