import type { MenuWhereIsTodayOption } from "@/core/domain/models/MenuWhereIsTodayOption";
import type { Neighborhood } from "@/core/domain/models/Neighborhood";
import type { OpeningPattern } from "@/core/domain/models/OpeningPattern";

export class StructureRepository {
    static async fetchMenuWhereIsToday(): Promise<MenuWhereIsTodayOption[]> {
        const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "/");
        const res = await fetch(`${base}data/structure/menu-whereistoday.json`);
        if (!res.ok) {
            throw new Error("Erro ao carregar o menu \"Onde é hoje?\"");
        }
        return res.json();
    }

    static async fetchOpeningPatterns(): Promise<OpeningPattern[]> {
        const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "/");
        const res = await fetch(`${base}data/structure/opening-pattern.json`);
        if (!res.ok) {
            throw new Error("Erro ao carregar as datas de abertura e fechamento");
        }
        return res.json();
    }

    static async fetchNeighborhoodList(): Promise<Neighborhood[]> {
        const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "/");
        const res = await fetch(`${base}data/structure/neighborhood-list.json`);
        if (!res.ok) {
            throw new Error("Erro ao carregar a lista de bairros");
        }
        return res.json();
    }
}
