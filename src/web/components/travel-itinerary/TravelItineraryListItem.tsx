import React from "react";
import { AppButton } from "@/web/components/ui/AppButton";
import { getTourTypeLabel } from '@/core/domain/enums/tourTypeLabel';

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
      <div className="category-card-label font-bold uppercase tracking-[0.03em] text-sm sm:text-base min-w-0 col-start-2 col-end-4 row-start-1 truncate">
        {name}
      </div>
      <div className="flex flex-col gap-1 min-w-0 col-start-2 row-start-2">
        <div className="flex items-center text-xs sm:text-sm text-[#403E44] min-w-0">
          <span className="truncate">{placesCountText}</span>
        </div>
        {typeLabel && (
          <div className="text-xs text-[#6B6B6B]">
            {typeLabel}
          </div>
        )}
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
