import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";
import type { MenuWhereIsTodayOption } from "@/core/domain/models/MenuWhereIsTodayOption";

export class MenuWhereIsTodayFilterService {
    static applyOption(
        option: MenuWhereIsTodayOption,
        list: PlaceRecommendation[]
    ): PlaceRecommendation[] {
        // caso especial: "Aberto agora" (por enquanto, placeholder)
        if (option.title === "Aberto agora") {
            // TODO: no futuro, usar OpeningPattern + hora atual
            // por enquanto não filtra nada, só devolve todos
            return list;
        }

        // se não tiver tags, devolve tudo
        if (!option.tags || option.tags.length === 0) {
            return list;
        }

        // para cada tag, aplicamos filtros
        let result = list;

        for (const tag of option.tags) {
            result = this.applySingleTag(tag, result);
        }

        return result;
    }

    /**
     * Aplica um único tag de filtro sobre a lista.
     * Aqui mapeamos tags do JSON para campos do PlaceRecommendation.
     */
    private static applySingleTag(
        tag: string,
        list: PlaceRecommendation[]
    ): PlaceRecommendation[] {
        switch (tag) {
            case "RESTAURANTS":
                return list.filter((item) => item.type === "RESTAURANTS");

            case "BARS":
                return list.filter((item) => item.type === "BARS");

            case "COFFEES":
                return list.filter((item) => item.type === "COFFEES");

            case "NIGHTLIFE":
                return list.filter((item) => item.type === "NIGHTLIFE");

            case "NATURE":
                return list.filter((item) => item.type === "NATURE");

            case "TOURIST_SPOT":
                return list.filter((item) => item.type === "TOURIST_SPOT");

            case "FREE":
                return list.filter((item) => item.priceRange === "FREE");

            default:
                return list;
        }
    }
}
