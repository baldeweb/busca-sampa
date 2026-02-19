import { placeHasType, type PlaceRecommendation } from "../domain/models/PlaceRecommendation";

export const RecommendationService = {
    filterByType(list: PlaceRecommendation[], type: string) {
        return list.filter((item) => placeHasType(item, type));
    },

    filterByNeighborhood(list: PlaceRecommendation[], neighborhood: string) {
        return list.filter(
            (item) =>
                item.addresses.some(
                    (addr) =>
                        addr.neighborhood.toLowerCase() === neighborhood.toLowerCase()
                )
        );
    },

    orderByName(list: PlaceRecommendation[]) {
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
    },

    getById(list: PlaceRecommendation[], id: number) {
        return list.find((item) => item.id === id) || null;
    },
};
