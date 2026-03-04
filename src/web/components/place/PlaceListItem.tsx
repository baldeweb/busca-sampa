import React from "react";
import icPin from "@/assets/imgs/icons/ic_pin.png";
import { AppButton } from "@/web/components/ui/AppButton";
import { AppText } from "../ui/AppText";

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
    ? "category-card grid grid-cols-[auto,1fr,auto] grid-rows-[auto,auto] items-start gap-x-4 gap-y-0 border border-[#0F0D13] bg-[#F5F5F5] px-3"
    : "grid grid-cols-[auto,1fr,auto] grid-rows-[auto,auto] items-start gap-x-4 gap-y-0 bg-white border border-[#403E44] rounded-[8px] px-4 py-3";

  const infoWrapperClassName = isNeighborhood
    ? "flex flex-col gap-1 min-w-0 col-start-2 row-start-2 mt-2"
    : "flex flex-col gap-1 min-w-0 col-start-2 row-start-2";

  return (
    <div className={containerClassName}>
      <div className="w-14 h-14 rounded-full bg-[#CFCFCF] flex items-center justify-center flex-shrink-0 row-span-2 self-center">
        <img src={iconSrc} alt="" className="w-7 h-7 object-contain" />
      </div>
      <AppText variant="subtitle-light" className="category-card-label min-w-0 col-start-2 col-end-4 row-start-1 truncate">{name}</AppText>
      <div className={infoWrapperClassName}>
        <div className="flex items-center min-w-0">
          <img src={icPin} alt="" className="w-3 h-3 mr-1 flex-shrink-0" />
          <AppText variant="body-light" className="truncate">{neighborhood}</AppText>
        </div>
        <AppText variant="body-light" className="flex items-center truncate">{openingText}</AppText>
      </div>
      <AppButton
        variant="outline"
        size="sm"
        onClick={onDetails}
        className="flex-shrink-0 min-w-[96px] self-center"
      >
        {detailsLabel}
      </AppButton>
    </div>
  );
};
