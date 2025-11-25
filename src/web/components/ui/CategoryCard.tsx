import { type ReactNode } from "react";

interface CategoryCardProps {
  label: ReactNode;
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
        "shrink-0 grid grid-rows-[auto_auto] items-center justify-items-center gap-1 sm:gap-2 w-[86px] h-[86px] sm:w-[116px] sm:h-[116px] rounded-[6px] border text-center snap-start",
        selected
          ? "border-bs-red bg-bs-card-light text-black shadow"
          : "border-[#0F0D13] bg-[#E5E5E5] text-black hover:border-bs-red",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-bs-red/70 focus:ring-offset-2 focus:ring-offset-transparent",
      ].join(" ")}
    >
      <div className="h-8 sm:h-10 flex items-center justify-center text-2xl sm:text-4xl pt-4" aria-hidden="true">{icon}</div>
      <span className="text-[0.55rem] sm:text-[0.6rem] font-bold uppercase leading-tight whitespace-normal text-cente pb-4">
        {label}
      </span>
    </button>
  );
}
