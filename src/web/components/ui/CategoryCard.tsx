import { type ReactNode } from "react";

interface CategoryCardProps {
  label: string;
  icon: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  index?: number;
}

export function CategoryCard({ label, icon, selected, onClick, index }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="option"
      aria-selected={selected}
      tabIndex={index === 0 ? 0 : -1}
      className={[
        "shrink-0 flex flex-col items-center justify-center gap-3 w-[116px] h-[116px] rounded-[6px] border text-center snap-start",
        selected
          ? "border-bs-red bg-bs-card-light text-black shadow"
          : "border-[#0F0D13] bg-white/90 text-black hover:border-bs-red",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-bs-red/70 focus:ring-offset-2 focus:ring-offset-transparent",
      ].join(" ")}
    >
      <div className="flex items-center justify-center text-4xl" aria-hidden="true">{icon}</div>
      <span className="text-[0.6rem] font-bold uppercase leading-tight">
        {label}
      </span>
    </button>
  );
}
