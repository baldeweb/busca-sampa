import { useEffect, useState } from "react";
import { StructureRepository } from "@/data/repositories/StructureRepository";
import type { Neighborhood } from "@/core/domain/models/Neighborhood";

export function useNeighborhoodList() {
    const [data, setData] = useState<Neighborhood[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        StructureRepository.fetchNeighborhoodList()
            .then((res) => {
                if (!isMounted) return;
                try {
                    const sorted = (res || []).slice().sort((a, b) => {
                        const na = (a.neighborhoodName || '').trim();
                        const nb = (b.neighborhoodName || '').trim();
                        return na.localeCompare(nb, 'pt-BR', { sensitivity: 'base' });
                    });
                    setData(sorted);
                } catch (e) {
                    // fallback to original order on any error
                    setData(res);
                }
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error("Erro ao carregar neighborhood-list:", err);
                setError(err as Error);
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, loading, error };
}
