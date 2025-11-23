interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  underline?: boolean;
  sizeClass?: string;
  trackingClass?: string; // novo: controlar espaçamento entre letras
  id?: string;
}

import { Text } from './Text';

export function SectionHeading({ title, subtitle, className, underline = true, sizeClass, trackingClass, id }: SectionHeadingProps) {
  // Titles should be uppercase by design
  const upper = title ? title.toUpperCase() : title;

  const headingClassParts = [sizeClass || 'text-sm'];
  if (trackingClass) headingClassParts.push(trackingClass);
  const headingClass = headingClassParts.join(' ');

  return (
    <div className={className}>
      <Text id={id} as="h2" variant="sectionTitle" size={(sizeClass && sizeClass.includes('2xl')) ? 'xl' : 'lg'} className={headingClass}>
        {upper}
      </Text>
      {underline && <div className="mt-1 h-[3px] w-24 bg-bs-red" />}
      {subtitle && (
        <Text as="p" variant="body" size="sm" className="mt-2 max-w-md">
          {subtitle}
        </Text>
      )}
    </div>
  );
}
