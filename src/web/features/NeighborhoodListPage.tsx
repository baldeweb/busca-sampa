import React, { useMemo, useState } from "react";
import { BackHeader } from '@/web/components/layout/BackHeader';
import { useParams, useNavigate } from "react-router-dom";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { slugify } from "@/core/services/Slugify";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import { useTranslation } from 'react-i18next';
import { ActionButton } from '@/web/components/ui/ActionButton';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { CategoryCard } from '@/web/components/ui/CategoryCard';
import flagSp from '@/assets/imgs/flags/flag_sp.png';
import icBars from '@/assets/imgs/icons/ic_bars.png';
import icCoffee from '@/assets/imgs/icons/ic_coffee.png';
import icDoorOpened from '@/assets/imgs/icons/ic_door_opened.png';
import icFree from '@/assets/imgs/icons/ic_free.png';
import icNightlife from '@/assets/imgs/icons/ic_nightlife.png';
import icNature from '@/assets/imgs/icons/ic_nature.png';
import icRestaurants from '@/assets/imgs/icons/ic_restaurants.png';
import icTouristSpot from '@/assets/imgs/icons/ic_tourist_spot.png';

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
  const ORDER_OPTIONS = [
    { value: 'name-asc' },
    { value: 'name-desc' },
    { value: 'type-asc' },
    { value: 'type-desc' },
  ];
  const [order, setOrder] = useState(ORDER_OPTIONS[0].value);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  const filteredPlaces = useMemo(() => {
    if (!selectedType) return neighborhoodPlaces;
    return neighborhoodPlaces.filter((p) => p.type === selectedType);
  }, [neighborhoodPlaces, selectedType]);

  const sortedPlaces = useMemo(() => {
    const arr = [...filteredPlaces];
    switch (order) {
      case 'name-asc':
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        arr.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'type-asc':
        arr.sort((a, b) => getPlaceTypeLabel(a.type).localeCompare(getPlaceTypeLabel(b.type)));
        break;
      case 'type-desc':
        arr.sort((a, b) => getPlaceTypeLabel(b.type).localeCompare(getPlaceTypeLabel(a.type)));
        break;
    }
    return arr;
  }, [filteredPlaces, order]);

  const titleNeighborhood = slug?.replace(/-/g, " ") || "";

  return (
    <div className="min-h-screen bg-bs-bg text-white flex flex-col">
      <BackHeader onBack={() => navigate(-1)} />
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-12 py-6 sm:py-12 text-black">
          <SectionHeading title={titleNeighborhood} underline={false} sizeClass="text-lg sm:text-2xl text-black" />
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {t('neighborhoodList.intro')}
          </p>
        </div>
      </section>

      {/* Filtro por tipo (carrossel de CategoryCard igual à Home) */}
      {placeTypes.length > 0 && (
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
          <div className="mx-auto max-w-5xl px-4 sm:px-12 pb-8 text-black">
            <h3 className="font-bold text-base sm:text-lg mb-2">{t('placeList.environmentTitle') || 'Tipo de lugar:'}</h3>
              <div className="relative">
              <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory w-full justify-start">
                {placeTypes.length > 1 && (
                  <CategoryCard
                    key="all-types"
                    label={t('common.all')}
                    icon={<img src={flagSp} alt="all" className="w-8 h-8" />}
                    selected={false}
                    onClick={() => setSelectedType(null)}
                    index={0}
                  />
                )}
                {placeTypes.map((pt, idx) => {
                  const key = (pt || '').toString().replace(/-/g, '_').toUpperCase();
                  let iconSrc = flagSp;
                  if (key === 'FREE') iconSrc = icFree;
                  else if (key === 'BAR' || key === 'BARS') iconSrc = icBars;
                  else if (key === 'COFFEE' || key === 'COFFEES') iconSrc = icCoffee;
                  else if (key === 'ABERTO' || key === 'ABERTO_AGORA') iconSrc = icDoorOpened;
                  else if (key === 'NIGHTLIFE') iconSrc = icNightlife;
                  else if (key === 'NATURE') iconSrc = icNature;
                  else if (key === 'RESTAURANT' || key === 'RESTAURANTS') iconSrc = icRestaurants;
                  else if (key === 'TOURIST_SPOT' || key === 'TOURIST_SPOTS') iconSrc = icTouristSpot;

                  return (
                    <CategoryCard
                      key={pt}
                      label={getPlaceTypeLabel(pt)}
                      icon={<img src={iconSrc} alt={pt} className="w-10 h-10 sm:w-12 sm:h-12" />}
                      selected={selectedType === pt}
                      onClick={() => setSelectedType(selectedType === pt ? null : pt)}
                      index={placeTypes.length > 1 ? idx + 1 : idx}
                    />
                  );
                })}
              </div>
            </div>
            {/* Removed 'VER MAIS' button per design decision */}
          </div>
        </section>
      )}

      {/* Filtro de ordenação */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-12 py-4 text-black">
            <div className="flex items-center justify-end">
                <div className="flex items-center gap-3">
                    <label className="font-bold">{t('common.filter')}</label>
                    <div className="relative inline-block">
            <button
                className="bg-bs-card text-white px-3 py-2 rounded border border-bs-red font-bold text-xs"
                onClick={() => setShowOrderDropdown((v) => !v)}
            >
                {(() => {
                    switch (order) {
                        case 'name-asc': return t('list.orderNameAsc');
                        case 'name-desc': return t('list.orderNameDesc');
                        case 'type-asc': return t('list.orderNeighborhoodAsc');
                        case 'type-desc': return t('list.orderNeighborhoodDesc');
                        default: return '';
                    }
                })()}
            </button>
            {showOrderDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-bs-card border border-bs-red rounded shadow-lg z-10">
                    {ORDER_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            className="block w-full text-left px-4 py-2 text-white hover:bg-bs-red"
                            onClick={() => {
                                setOrder(opt.value);
                                setShowOrderDropdown(false);
                            }}
                        >
                            {(() => {
                                switch (opt.value) {
                                    case 'name-asc': return t('list.orderNameAsc');
                                    case 'name-desc': return t('list.orderNameDesc');
                                    case 'type-asc': return t('list.orderNeighborhoodAsc');
                                    case 'type-desc': return t('list.orderNeighborhoodDesc');
                                    default: return '';
                                }
                            })()}
                        </button>
                    ))}
                </div>
            )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Lista de lugares (estilo igual ao de categorias) */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] flex-1">
        <div className="mx-auto max-w-5xl px-0 sm:px-12">
          <div className="rounded-t-lg overflow-hidden">
            <div className="flex bg-bs-card text-[#F5F5F5] font-bold text-lg sm:text-[20px] leading-tight border-b-2 border-bs-red">
              <div className="w-1/3 px-4 sm:px-12 py-3">{t('list.nameHeader')}</div>
              <div className="w-1/3 py-3 ps-4 sm:ps-6">{t('list.typeHeader')}</div>
            </div>
            {sortedPlaces.length === 0 && (
              <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>
            )}
            {sortedPlaces.map((place, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-[#403E44]' : 'bg-[#48464C]';
                return (
                <div
                  key={place.id}
                  className={`flex items-center ${rowBg} px-4 sm:px-12 border-b border-bs-bg text-sm sm:text-base text-[#F5F5F5]`}
                >
                  <div className="w-1/3 px-0 py-6">{place.name}</div>
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
                      size="md"
                    >
                      {t('common.details')}
                    </ActionButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
