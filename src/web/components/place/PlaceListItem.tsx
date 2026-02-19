import React from "react";
import icPin from "@/assets/imgs/icons/ic_pin.png";
import { AppButton } from "@/web/components/ui/AppButton";

export type PlaceListItemVariant = "place" | "neighborhood";

interface PlaceListItemProps {
  name: string;
  neighborhood: string;
  openingText: string;
  iconSrc: string;
  onDetails: () => void;
  detailsLabel: string;
  variant?: PlaceListItemVariant;
}

export const PlaceListItem: React.FC<PlaceListItemProps> = ({
  name,
  neighborhood,
  openingText,
  iconSrc,
  onDetails,
  detailsLabel,
  variant = "place",
}) => {
  const isNeighborhood = variant === "neighborhood";

  const containerClassName = isNeighborhood
    ? "category-card grid grid-cols-[auto,1fr,auto] grid-rows-[auto,auto] items-start gap-x-4 gap-y-0 border border-[#0F0D13] bg-[#F5F5F5] text-black px-3 text-left"
    : "grid grid-cols-[auto,1fr,auto] grid-rows-[auto,auto] items-start gap-x-4 gap-y-0 bg-white border border-[#403E44] rounded-[8px] px-4 py-3 text-[#403E44]";

  const infoWrapperClassName = isNeighborhood
    ? "flex flex-col gap-1 min-w-0 col-start-2 row-start-2 mt-2"
    : "flex flex-col gap-1 min-w-0 col-start-2 row-start-2";

  const rowTextClassName = isNeighborhood
    ? "flex items-center text-xs sm:text-sm text-black min-w-0"
    : "flex items-center text-xs sm:text-sm text-[#403E44] min-w-0";

  const pinIconClassName = isNeighborhood ? "w-3 h-3 mr-1 flex-shrink-0" : "w-3 h-3 mr-1 flex-shrink-0";

  return (
    <div className={containerClassName}>
      <div className="w-14 h-14 rounded-full bg-[#CFCFCF] flex items-center justify-center flex-shrink-0 row-span-2 self-center">
        <img src={iconSrc} alt="" className="w-7 h-7 object-contain" />
      </div>
      <div className="category-card-label font-bold uppercase tracking-[0.03em] text-sm sm:text-base min-w-0 col-start-2 col-end-4 row-start-1 truncate">
        {name}
      </div>
      <div className={infoWrapperClassName}>
        <div className={rowTextClassName}>
          <img src={icPin} alt="" className={pinIconClassName} />
          <span className="truncate">{neighborhood}</span>
        </div>
        <div className={rowTextClassName}>
          <span className="truncate">{openingText}</span>
        </div>
      </div>
      <AppButton
        variant="outline"
        size="xxs"
        onClick={onDetails}
        className="flex-shrink-0 min-w-[96px] col-start-3 row-start-2 self-center mb-0 btn-hover-red"
      >
        {detailsLabel}
      </AppButton>
    </div>
  );
};
