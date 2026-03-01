import { useEffect, useState } from "react";
import { fetchRecommendations } from "@/data/repositories/RecommendationRepository";
import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";

export function useRecommendationList(category: string) {
  const [data, setData] = useState<PlaceRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const normalizedCategory = String(category || "").trim();

    // Allow callers to pass an empty category to avoid unnecessary network work.
    if (!normalizedCategory) {
      setData([]);
      setLoading(false);
      setError(null);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setError(null);

    fetchRecommendations(normalizedCategory)
      .then((res) => {
        if (!isMounted) return;
        setData(res);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(`Erro ao carregar ${normalizedCategory}.json:`, err);
        setError(err as Error);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { data, loading, error };
}