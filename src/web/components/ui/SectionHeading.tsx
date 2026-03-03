interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  underline?: boolean;
  sizeClass?: string;
  trackingClass?: string; // novo: controlar espaçamento entre letras
  id?: string;
  leadingIcon?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  card?: boolean;
  layout?: 'row' | 'stackOnMobile';
  tone?: 'light' | 'dark';
}

import { AppText, type AppTextVariant } from './AppText';

export function SectionHeading({
  title,
  subtitle,
  className,
  underline = true,
  sizeClass,
  trackingClass,
  id,
  leadingIcon,
  trailing,
  children,
  card = true,
  layout = 'row',
  tone,
}: SectionHeadingProps) {
  // Titles should be uppercase by design
  const upper = title ? title.toUpperCase() : title;

  const resolvedTone: 'light' | 'dark' = tone || 'light';
  const titleVariant = `title-${resolvedTone}` as AppTextVariant;
  const subtitleVariant = `subtitle-${resolvedTone}` as AppTextVariant;

  const headingClassParts = [sizeClass, 'break-words'];
  if (trackingClass) headingClassParts.push(trackingClass);
  const headingClass = headingClassParts.filter(Boolean).join(' ');

  const subtitleNode = subtitle ? (
    <AppText as="p" variant={subtitleVariant} className="mt-2 max-w-2xl whitespace-pre-line">
      {subtitle}
    </AppText>
  ) : null;

  if (!card) {
    return (
      <div className={className}>
        <AppText id={id} as="h2" variant={titleVariant} className={headingClass}>
          <span className="inline-flex items-center gap-2">
            {leadingIcon}
            <span>{upper}</span>
          </span>
        </AppText>
        {underline && <div className="mt-1 h-[3px] w-24 bg-bs-red" />}
        {subtitleNode}
        {children}
      </div>
    );
  }

  const innerLayoutClass = layout === 'stackOnMobile'
    ? 'flex flex-col sm:flex-row sm:items-start gap-4'
    : 'flex items-start gap-4';

  return (
    <div className={`w-full bg-[#F5F5F5] border border-[#8492A6] rounded-b-[8px] px-4 pt-6 pb-4 ${className || ''}`}>
      <div className={innerLayoutClass}>
        {leadingIcon ? <div className="shrink-0">{leadingIcon}</div> : null}
        <div className="flex-1 min-w-0">
          <AppText id={id} as="h2" variant={titleVariant} className={headingClass}>
            <span className="inline-flex items-center gap-2">
              <span>{upper}</span>
            </span>
          </AppText>
          {underline && <div className="mt-1 h-[3px] w-24 bg-bs-red" />}
          {subtitleNode}
          {children}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </div>
  );
}
