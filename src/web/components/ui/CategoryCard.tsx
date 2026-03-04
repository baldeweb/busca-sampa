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

export function CategoryCard({ label, icon, selected, lightSelected = false, onClick, index }: CategoryCardProps) {
    return (
    <AppButton
      variant="square"
      size="lg"
      onClick={onClick}
      role="option"
      aria-selected={selected}
      tabIndex={index === 0 ? 0 : -1}
      className={"flex gap-2 w-full px-2 sm:px-4"}
    >
      {icon} {label}
    </AppButton>
  );
}
