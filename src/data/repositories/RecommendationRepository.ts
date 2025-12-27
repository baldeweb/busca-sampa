import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";

export async function fetchRecommendations(
    category: string
): Promise<PlaceRecommendation[]> {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "/");
    const url = `${base}data/places/${category}.json`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Erro ao carregar ${category}.json`);
    }

    return res.json();
}
