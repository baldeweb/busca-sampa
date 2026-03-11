import React from "react";
import { AppButton } from "@/web/components/ui/AppButton";
import { getTourTypeLabel } from '@/core/domain/enums/tourTypeLabel';
import { AppText } from "../ui/AppText";

interface TravelItineraryListItemProps {
  name: string;
  placesCountText: string;
  iconSrc: string;
  onDetails: () => void;
  detailsLabel: string;
  tourType?: string | null;
}

export const TravelItineraryListItem: React.FC<TravelItineraryListItemProps> = ({
  name,
  placesCountText,
  iconSrc,
  onDetails,
  detailsLabel,
  tourType,
}) => {
  const typeLabel = tourType ? getTourTypeLabel(tourType) : null;
  return (
    <div className="grid grid-cols-[auto,1fr,auto] grid-rows-[auto,auto] items-start gap-x-4 gap-y-0 bg-white border border-[#403E44] rounded-[8px] px-4 py-3 text-[#403E44]">
      <div className="w-14 h-14 rounded-full bg-[#CFCFCF] flex items-center justify-center flex-shrink-0 row-span-2 self-center">
        <img src={iconSrc} alt="" className="w-7 h-7 object-contain" />
      </div>
      <AppText 
        variant="selected-light" 
        className="min-w-0 col-start-2 col-end-4 row-start-1 truncate [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
          {name}
        </AppText>
      <div className="flex flex-col gap-1 min-w-0 col-start-2 row-start-2">
        <AppText variant="body-light" className="flex items-center min-w-0 truncate">{placesCountText}</AppText>
        {typeLabel && (
          <AppText variant="body-light" className="truncate">{typeLabel}</AppText>
        )}
      </div>
      <AppButton
        variant="outline"
        size="sm"
        onClick={onDetails}
        className="flex-shrink-0 min-w-[96px] col-start-3 row-start-2 self-center mb-0 mt-4"
      >
        {detailsLabel}
      </AppButton>
    </div>
  );
};
