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
      className={"flex gap-2 w-full px-2 sm:px-4"}
    >
      <span className="w-6 h-6 flex items-center justify-center shrink-0" aria-hidden="true">
        {icon}
      </span>
      {label}
    </AppButton>
  );
}
