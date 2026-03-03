import React, { type ReactNode } from 'react';

type Tone = 'light' | 'dark';

type AppTextBaseVariant = 'title' | 'subtitle' | 'body' | 'btn-sm' | 'btn-md' | 'btn-lg';
export type AppTextVariant = `${AppTextBaseVariant}-${Tone}`;

export interface AppTextProps {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  variant?: AppTextVariant;
  className?: string;
  id?: string;
}

const VARIANT_CLASSES: Record<AppTextVariant, string> = {
  'title-light': 'font-gothic font-bold uppercase leading-tight text-[1.3rem] sm:text-[1.6rem] text-[#212121]',
  'title-dark': 'font-gothic font-bold uppercase leading-tight text-[1.3rem] sm:text-[1.6rem] text-[#F5F5F5]',

  'subtitle-light': 'font-montserrat font-regular leading-snug text-[0.9rem] sm:text-[1.1rem] text-[#212121]',
  'subtitle-dark': 'font-montserrat font-regular leading-snug text-[0.9rem] sm:text-[1.1rem] text-[#F5F5F5]',

  'body-light': 'font-montserrat leading-relaxed text-[0.6rem] text-[#212121]',
  'body-dark': 'font-montserrat leading-relaxed text-[0.6rem] text-gray-300',

  'btn-sm-light': 'font-gothic font-semibold text-[0.1rem] tracking-[0.12em] text-[#212121]',
  'btn-sm-dark': 'font-gothic font-semibold text-[0.1rem] tracking-[0.12em] text-[#F5F5F5]',

  'btn-md-light': 'font-gothic font-semibold text-[0.4rem] tracking-[0.12em] text-[#212121]',
  'btn-md-dark': 'font-gothic font-semibold text-[0.4rem] tracking-[0.12em] text-[#F5F5F5]',

  'btn-lg-light': 'font-gothic font-semibold text-[0.8rem] tracking-[0.12em] text-[#212121]',
  'btn-lg-dark': 'font-gothic font-semibold text-[0.8rem] tracking-[0.12em] text-[#F5F5F5]',
};

export function AppText({ children, as = 'p', variant = 'body-dark', className = '', id }: AppTextProps) {
  // eslint-disable-next-line react/jsx-pascal-case
  const Component: any = as;

  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(' ').trim();
  return (
    <Component id={id} className={classes}>
      {children}
    </Component>
  );
}
