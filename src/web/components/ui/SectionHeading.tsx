interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  underline?: boolean;
  sizeClass?: string;
  trackingClass?: string; // novo: controlar espaçamento entre letras
}

export function SectionHeading({ title, subtitle, className, underline = true, sizeClass, trackingClass }: SectionHeadingProps) {
  function sentenceCase(s: string) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  const headingClass = [sizeClass || "text-sm", "font-bold", trackingClass || "tracking-[0.12em]"]
    .join(" ");
  return (
    <div className={className}>
      <h2 className={headingClass}>{sentenceCase(title)}</h2>
      {underline && <div className="mt-1 h-[3px] w-24 bg-bs-red" />}
      {subtitle && (
        <p className="mt-2 text-[0.7rem] text-gray-300 leading-relaxed max-w-md">{subtitle}</p>
      )}
    </div>
  );
}
