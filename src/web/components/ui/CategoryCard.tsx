import { type ReactNode } from "react";

interface CategoryCardProps {
  label: ReactNode;
  icon: ReactNode;
  selected?: boolean;
  lightSelected?: boolean;
  onClick?: () => void;
  index?: number;
}

export function CategoryCard({ label, icon, selected, lightSelected = false, onClick, index }: CategoryCardProps) {
    return (
    <button
      type="button"
      onClick={onClick}
      role="option"
      aria-selected={selected}
      tabIndex={index === 0 ? 0 : -1}
      className={[
        "category-card flex items-center gap-2 w-full border px-1 sm:px-2 text-left hover:bg-[#D6D6D6] hover:text-black hover:border-[#212121]",
        selected
          ? (lightSelected ? "border-bs-red bg-[#F5F5F5] text-black shadow" : "border-bs-red bg-bs-card-light text-black shadow")
          : "border-[#0F0D13] bg-[#E5E5E5] text-black",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-bs-red/70 focus:ring-offset-2 focus:ring-offset-transparent",
      ].join(" ")}
    >
      <div className="flex items-center py-[-1rem] justify-center ml-2" aria-hidden="true">{icon}</div>
      <span className="category-card-label py-[-1rem] text-[0.70rem] sm:text-[0.85rem] font-semibold leading-[1.00] whitespace-normal">
        {label}
      </span>
    </button>
  );
}
