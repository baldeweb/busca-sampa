import React from "react";
import { getPriceRangeLabel } from "@/core/domain/enums/priceRangeLabel";

interface Props {
  options: string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
  showAnyOption?: boolean;
  anyLabel?: string;
  itemClassName?: string;
  activeClassName?: (isActive: boolean) => string;
}

export const PriceFilterList: React.FC<Props> = ({
  options,
  selected,
  onSelect,
  showAnyOption = true,
  anyLabel = "Qualquer preço",
  itemClassName = "block w-full text-left px-3 py-2 text-sm hover:bg-gray-100",
  activeClassName = (isActive: boolean) => (isActive ? "font-semibold" : "")
}) => {
  return (
    <>
      {showAnyOption && (
        <button
          type="button"
          className={`${itemClassName} ${activeClassName(selected === null)}`}
          onClick={() => onSelect(null)}
        >
          {anyLabel}
        </button>
      )}
      {options.map((p) => (
        <button
          key={p}
          type="button"
          className={`${itemClassName} ${activeClassName(selected === p)}`}
          onClick={() => onSelect(p)}
        >
          {getPriceRangeLabel(p as any)}
        </button>
      ))}
    </>
  );
};
