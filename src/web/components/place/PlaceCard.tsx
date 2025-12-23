import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";
import { getPriceRangeLabel } from "@/core/domain/enums/priceRangeLabel";
import { useNavigate } from "react-router-dom";
import { slugify } from '@/core/services/Slugify';

interface Props {
    place: PlaceRecommendation;
}

export function PlaceCard({ place }: Props) {
    const mainAddress = place.addresses[0];
    const neighborhood = mainAddress?.neighborhood ?? "São Paulo";
    const isVisited = place.isAlreadyVisited;
    const price = getPriceRangeLabel(place.priceRange);
    const style = place.tags?.[0] ?? "";
    const navigate = useNavigate();

    function resolveCategoryKey(): string {
        switch (place.type) {
            case "RESTAURANT": return "restaurants";
            case "BAR": return "bars";
            case "COFFEE": return "coffees";
            case "NATURE": return "nature";
            case "NIGHTLIFE": return "nightlife";
            case "TOURIST_SPOT": return "tourist-spot";
            default: return "unknown";
        }
    }

    return (
        <div
            className="rounded-app bg-bs-card border border-white/10 overflow-hidden shadow-md hover:border-bs-red transition-colors cursor-pointer"
            onClick={() => navigate(`/${resolveCategoryKey()}/${slugify(place.name)}`)}
        >
            {/* Conteúdo */}
            <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
                {/* Nome + selo “já visitei” */}
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm sm:text-base">{place.name}</h3>
                    {isVisited && (
                        <span className="text-[0.6rem] px-2 py-[2px] rounded bg-bs-red text-white uppercase tracking-wider">
                            já fui
                        </span>
                    )}
                </div>
                {/* Bairro */}
                <p className="text-xs text-gray-300">{neighborhood}</p>
                {/* Linha divisória */}
                <div className="h-[2px] w-14 bg-bs-red rounded" />
                {/* Faixa de preço */}
                <p className="text-xs">
                    <span className="text-gray-300">Preço:</span>{" "}
                    <span className="font-semibold">{price}</span>
                </p>
                {/* Horário especial CHECK_AVAILABILITY_DAYTIME */}
                {(place.openingHours.patternId === 'CHECK_AVAILABILITY_DAYTIME') && (
                    <p className="text-sm text-gray-200">
                        {/* @ts-ignore */}
                        {require('react-i18next').useTranslation().t('openingHours.checkAvailabilityLabel')}
                    </p>
                )}
                {/* Estilo culinário */}
                {style && (
                    <p className="text-xs text-gray-300">
                        Culinária: <span className="font-semibold">{style}</span>
                    </p>
                )}
            </div>
        </div>
    );
}
