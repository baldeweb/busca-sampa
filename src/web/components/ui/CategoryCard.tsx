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
        "shrink-0 grid grid-rows-[auto_auto] items-center justify-items-center gap-1 sm:gap-2 w-[90px] h-[90px] sm:w-[128px] sm:h-[128px] rounded-[6px] border text-center snap-start",
        selected
          ? "border-bs-red bg-bs-card-light text-black shadow"
          : "border-[#0F0D13] bg-[#E5E5E5] text-black hover:border-bs-red",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-bs-red/70 focus:ring-offset-2 focus:ring-offset-transparent",
      ].join(" ")}
    >
      <div className="h-10 sm:h-12 flex items-center justify-center text-2xl sm:text-4xl pt-3" aria-hidden="true">{icon}</div>
      <span className="text-[0.55rem] sm:text-[0.6rem] font-bold uppercase leading-tight whitespace-normal text-cente pb-3">
        {label}
      </span>
    </button>
  );
}
