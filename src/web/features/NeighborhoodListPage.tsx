import React, { useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { slugify } from "@/core/services/Slugify";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import { useTranslation } from 'react-i18next';
import { ActionButton } from '@/web/components/ui/ActionButton';

// Página que lista todos os lugares de um bairro específico,
// permitindo filtrar por "tipo" (RESTAURANT, NIGHTLIFE, etc)
export const NeighborhoodListPage: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Carrega todas as categorias de lugares
  const { data: restaurants } = useRecommendationList("restaurants");
  const { data: bars } = useRecommendationList("bars");
  const { data: coffees } = useRecommendationList("coffees");
  const { data: nightlife } = useRecommendationList("nightlife");
  const { data: nature } = useRecommendationList("nature");
  const { data: touristSpots } = useRecommendationList("tourist-spot");

  const allPlaces = useMemo(
    () => [
      ...restaurants,
      ...bars,
      ...coffees,
      ...nightlife,
      ...nature,
      ...touristSpots,
    ],
    [restaurants, bars, coffees, nightlife, nature, touristSpots]
  );

  // Aliases para slugs especiais (acentuação ou variações)
  const slugAliases: Record<string, string[]> = {
    // Centro Histórico deve abranger variantes e áreas centrais adjacentes
    "centro-historico": ["centro-historico", "centro", "se"],
    // Rota /neighborhood/se deve considerar acentos
    "se": ["se"],
  };

  // Filtra lugares pelo slug do bairro, ignorando acentuação e aceitando aliases
  const neighborhoodPlaces = useMemo(() => {
    if (!slug) return [];
    const candidates = slugAliases[slug] || [slug];
    return allPlaces.filter((place) =>
      place.addresses?.some((addr) => {
        const raw = (addr.neighborhood || "").trim();
        if (!raw) return false;
        const addrSlug = slugify(raw);
        if (candidates.includes(addrSlug)) return true;
        // Comparação extra ignorando acentos sem separar por hífen
        const plain = raw
          .toLowerCase()
          .normalize("NFD")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .replace(/\u0300-\u036f/g, "");
        return candidates.includes(plain);
      })
    );
  }, [allPlaces, slug]);

  // Constrói lista de tipos presentes no bairro
  const placeTypes = useMemo(() => {
    const set = new Set<string>();
    neighborhoodPlaces.forEach((p) => {
      if (p.type) set.add(p.type);
    });
    return Array.from(set);
  }, [neighborhoodPlaces]);

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredPlaces = useMemo(() => {
    if (!selectedType) return neighborhoodPlaces;
    return neighborhoodPlaces.filter((p) => p.type === selectedType);
  }, [neighborhoodPlaces, selectedType]);

  const titleNeighborhood = slug?.replace(/-/g, " ") || "";

  return (
    <div className="min-h-screen bg-bs-bg text-white flex flex-col">
      <div className="bg-black border-b-2 border-bs-red">
        <div className="mx-auto max-w-5xl flex items-center px-4 pt-12 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-lg font-bold flex items-center"
          >
            <FaArrowLeft className="mr-2" /> {t('common.back')}
          </button>
        </div>
      </div>
      <div className="px-4 py-6 bg-[#F5F5F5] text-black">
        <SectionHeading title={titleNeighborhood} underline={false} sizeClass="text-2xl text-black" />
        <p className="text-lg text-gray-700 leading-relaxed">
          {t('neighborhoodList.intro')}
        </p>
      </div>

      {/* Filtro por tipo */}
      {placeTypes.length > 0 && (
        <div className="px-4 flex gap-2 flex-wrap bg-[#F5F5F5] text-black pb-4">
          {/* Chip reset */}
          <button
            className={`px-3 py-2 rounded border font-bold text-xs ${
              selectedType === null
                ? "bg-bs-red text-white border-bs-red"
                : "bg-bs-card text-white border-bs-red"
            }`}
            onClick={() => setSelectedType(null)}
          >
            {t('common.all')}
          </button>
          {placeTypes.map((t) => {
            const label = getPlaceTypeLabel(t);
            return (
              <button
                key={t}
                className={`px-3 py-2 rounded border font-bold text-xs ${
                  selectedType === t
                    ? "bg-bs-red text-white border-bs-red"
                    : "bg-bs-card text-white border-bs-red"
                }`}
                onClick={() => setSelectedType(selectedType === t ? null : t)}
              >
                {label}
              </button>
            );
          })}
          {/* Removed trailing 'Todos' button, replaced by first 'Tudo' */}
        </div>
      )}

      {/* Lista de lugares (estilo igual ao de categorias) */}
      <div className="px-0 flex-1 bg-[#48464C]">
        <div className="rounded-t-lg overflow-hidden">
          <div className="flex bg-bs-card text-[#F5F5F5] font-bold text-[24px] leading-tight border-b-2 border-bs-red">
            <div className="w-1/3 px-4 py-3">{t('list.nameHeader')}</div>
            <div className="w-1/3 px-4 py-3">{t('list.typeHeader')}</div>
          </div>
          {filteredPlaces.length === 0 && (
            <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>
          )}
          {filteredPlaces.map((place, idx) => {
            const rowBg = idx % 2 === 0 ? 'bg-[#403E44]' : 'bg-[#48464C]';
            return (
              <div
                key={place.id}
                className={`flex items-center ${rowBg} border-b border-bs-bg text-base text-[#F5F5F5]`}
              >
                <div className="w-1/3 px-4 py-6">{place.name}</div>
                <div className="w-1/3 px-4 py-6">{getPlaceTypeLabel(place.type)}</div>
                <div className="flex-1 flex justify-end pr-4">
                  <ActionButton
                    onClick={() => {
                      const typeMap: Record<string,string> = {
                        RESTAURANT: "restaurants",
                        BAR: "bars",
                        COFFEE: "coffees",
                        NIGHTLIFE: "nightlife",
                        NATURE: "nature",
                        TOURIST_SPOT: "tourist-spot",
                      };
                      const cat = typeMap[place.type] || "restaurants";
                      navigate(`/place/${cat}/${place.id}`);
                    }}
                    size="xs"
                  >
                    {t('common.details')}
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
