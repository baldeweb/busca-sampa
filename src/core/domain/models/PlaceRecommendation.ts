import type { Address } from "./Address";
import type { Phone } from "./Phone";
import type { OpeningHours } from "./OpeningHours";
import type { PriceRange } from "../enums/PriceRange";
import type { RecommendationType } from "../enums/RecommendationType";

export interface PlaceRecommendation {
    id: number;
    name: string;
    listTypes: RecommendationType[];
    phones: Phone[];
    openingHours: OpeningHours;
    isAlreadyVisited: boolean;
    isOpenOnSundays: boolean;
    isOpenOnMonday: boolean;
    isOpenOnHolidays: boolean;
    shouldSchedule: boolean;
    notes: string[];
    priceRange: PriceRange;
    addresses: Address[];
    linkMenu: string;
    linkWebsite: string;
    linkInstagram: string;
    tags?: string[];
}

export function getPlaceListTypes(place: PlaceRecommendation): RecommendationType[] {
    if (Array.isArray(place.listTypes) && place.listTypes.length > 0) {
        return place.listTypes;
    }
    return [];
}

export function getPrimaryPlaceType(place: PlaceRecommendation): RecommendationType | undefined {
    return getPlaceListTypes(place)[0];
}

export function placeHasType(place: PlaceRecommendation, type: string): boolean {
    const normalized = String(type || '').trim().toUpperCase();
    if (!normalized) return false;
    return getPlaceListTypes(place).some((itemType) => String(itemType || '').trim().toUpperCase() === normalized);
}
