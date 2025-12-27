import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";

export async function fetchRecommendations(
    category: string
): Promise<PlaceRecommendation[]> {
    const rawBase = import.meta.env.BASE_URL || "/";
    const normalizedBase = rawBase.startsWith("http")
        ? new URL(rawBase).pathname || "/"
        : rawBase;
    const basePath = ("/" + normalizedBase).replace(/\/+/g, "/").replace(/\/$/, "/");
    const url = `${basePath}data/places/${category}.json`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Erro ao carregar ${category}.json`);
    }

    return res.json();
}
