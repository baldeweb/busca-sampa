import type { Address } from "./Address";
import type { Phone } from "./Phone";
import type { OpeningHours } from "./OpeningHours";
import type { PriceRange } from "../enums/PriceRange";
import type { RecommendationType } from "../enums/RecommendationType";

export interface PlaceRecommendation {
    id: number;
    name: string;
    type: RecommendationType;
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
