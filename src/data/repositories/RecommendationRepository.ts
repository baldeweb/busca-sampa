import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";
import { resolvePublicUrl } from "./resolveBaseUrl";

export async function fetchRecommendations(
    category: string
): Promise<PlaceRecommendation[]> {
    const url = resolvePublicUrl(`data/places/${category}.json`);
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Erro ao carregar ${category}.json`);
    }

    return res.json();
}

