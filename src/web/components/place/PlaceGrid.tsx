import { PlaceCard } from "./PlaceCard";
import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";

interface Props {
    places: PlaceRecommendation[];
}

export function PlaceGrid({ places }: Props) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
            {places.map((p) => (
                <PlaceCard key={p.id} place={p} />
            ))}
        </div>
    );
}
