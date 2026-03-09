import { type ReactNode } from "react";
import { AppButton } from "./AppButton";

interface CategoryCardProps {
  label: ReactNode;
  icon: ReactNode;
  selected?: boolean;
  lightSelected?: boolean;
  onClick?: () => void;
  index?: number;
}

export function CategoryCard({ label, icon, selected, onClick, index }: CategoryCardProps) {
    return (
    <AppButton
      variant="square"
      size="md"
      onClick={onClick}
      aria-selected={selected}
      tabIndex={index === 0 ? 0 : -1}
      className={"flex flex-col items-start justify-start gap-2 w-full px-2 sm:px-4"}
    >
      <span className="w-6 h-6 flex items-start justify-start shrink-0 self-start" aria-hidden="true">
        {icon}
      </span>
      <span className="w-full text-left leading-tight">{label}</span>
    </AppButton>
  );
}
