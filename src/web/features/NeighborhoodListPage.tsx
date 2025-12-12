import React, { useMemo, useState } from "react";
import { useDocumentTitle } from '@/web/hooks/useDocumentTitle';
import { BackHeader } from '@/web/components/layout/BackHeader';
import { useParams, useNavigate } from "react-router-dom";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { slugify } from "@/core/services/Slugify";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import { useTranslation } from 'react-i18next';
import { useOpeningPatterns } from '@/web/hooks/useOpeningPatterns';
import { isOpenNow } from '@/core/domain/enums/openingHoursUtils';
import { ActionButton } from '@/web/components/ui/ActionButton';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { EnvironmentSelectModal } from '@/web/components/place/EnvironmentSelectModal';
import { FiltersModal } from '@/web/components/place/FiltersModal';
import icNeighborhood from '@/assets/imgs/icons/ic_neighborhood.png';
import icFilter from '@/assets/imgs/icons/ic_filter.png';

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
  const { data: pleasures } = useRecommendationList("pleasure");
  const { data: openingPatternsData } = useOpeningPatterns();
  const openingPatterns = openingPatternsData || [];

  const allPlaces = useMemo(
    () => [
      ...restaurants,
      ...bars,
      ...coffees,
      ...nightlife,
      ...nature,
      ...pleasures,
      ...touristSpots,
    ],
    [restaurants, bars, coffees, nightlife, nature, pleasures, touristSpots]
  );

  // Aliases para slugs especiais (acentuação ou variações)
  const slugAliases: Record<string, string[]> = {
    // Centro Histórico deve abranger variantes e áreas centrais adjacentes
    "centro-historico": ["centro-historico", "centro-histórico", "Centro Histórico", "centro", "se"],
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

  // Mapeia placeTypes para formato usado pelo filtro (label + value)
  const environments = useMemo(() => {
    return placeTypes.map(pt => ({ label: getPlaceTypeLabel(pt), value: pt }));
  }, [placeTypes]);

  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isListFading, setIsListFading] = useState<boolean>(false);
  const ORDER_OPTIONS = [
    { value: 'name-asc' },
    { value: 'name-desc' },
    { value: 'type-asc' },
    { value: 'type-desc' },
  ];
  const [order, setOrder] = useState(ORDER_OPTIONS[0].value);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);

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

  // Helper: get raw periods for a relative day (0 = today, 1 = tomorrow)
  function getPeriodsForDay(place: any, dayOffset = 0): any[] {
    const periods: any[] = [];
    const patternId = place.openingHours?.patternId;
    if (patternId) {
      const pat = (openingPatterns || []).find((p: any) => p.id === patternId);
      if (pat?.periods) periods.push(...pat.periods);
    }
    if (place.openingHours?.customOverrides && Array.isArray(place.openingHours.customOverrides)) {
      periods.push(...place.openingHours.customOverrides);
    }
    const now = new Date();
    const dayNames = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    const targetDay = dayNames[(now.getDay() + dayOffset) % 7];
    return periods.filter((p: any) => p.open && (p.days?.includes(targetDay) || p.days?.includes('EVERYDAY')));
  }

  function getPeriodsForToday(place: any): any[] {
    return getPeriodsForDay(place, 0);
  }

  // Helper: compute display value for the opening column per user's request
  function getOpeningDisplayForToday(place: any): string {
    const periods = getPeriodsForToday(place);
    // If there is no patternId and no custom overrides, explicitly show 'hours unavailable'
    if (!place.openingHours?.patternId && (!place.openingHours?.customOverrides || place.openingHours.customOverrides.length === 0)) {
      return t('placeList.hoursUnavailable', { defaultValue: 'Horário indisponível' });
    }
    if (!periods || periods.length === 0) return '-';

    // if currently open
    try { if (isOpenNow(periods)) return t('placeList.openNow', { defaultValue: 'Aberto agora' }); } catch (_) {}

    // compute next opening time (minutes)
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }

    let nextOpenMinutes: number | null = null;
    let nextOpenStr: string | null = null;
    for (const p of periods) {
      if (!p.open) continue;
      const om = parseTime(p.open);
      if (om > currentMinutes && (nextOpenMinutes === null || om < nextOpenMinutes)) {
        nextOpenMinutes = om;
        nextOpenStr = p.open;
      }
    }

    if (nextOpenMinutes !== null && nextOpenStr) {
      const diff = nextOpenMinutes - currentMinutes;
      if (diff <= 60) return t('placeList.opensSoon', { defaultValue: 'Abre em instantes' });
      return nextOpenStr;
    }

    // No more openings today — check tomorrow's first opening and present it (better than '-')
    const tomorrowPeriods = getPeriodsForDay(place, 1);
    if (tomorrowPeriods && tomorrowPeriods.length > 0) {
      // find earliest open tomorrow
      let earliest: string | null = null;
      function parseTime2(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
      for (const p of tomorrowPeriods) {
        if (!p.open) continue;
        if (earliest === null || parseTime2(p.open) < parseTime2(earliest)) earliest = p.open;
      }
      if (earliest) return earliest; // small UX: show time (tomorrow)
    }

    return '-';
  }

  const titleNeighborhoodRaw = slug?.replace(/-/g, " ") || "";
  const titleNeighborhood = titleNeighborhoodRaw
    ? titleNeighborhoodRaw.charAt(0).toUpperCase() + titleNeighborhoodRaw.slice(1)
    : "";
  useDocumentTitle(titleNeighborhood);

  return (
    <div className="min-h-screen bg-bs-bg text-white flex flex-col">
      <BackHeader onBack={() => navigate(-1)} />
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-12 py-6 sm:py-12 text-black">
            <div className="flex items-start gap-4">
              <img src={icNeighborhood} alt="neighborhood" className="w-12 h-12 object-contain" />
              <div>
                <SectionHeading title={titleNeighborhood} underline={false} sizeClass="text-2xl sm:text-3xl text-black" />
                <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{t('neighborhoodList.intro')}</p>
              </div>
            </div>
        </div>
      </section>

        <FiltersModal
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          order={order}
          setOrder={(v: string) => setOrder(v)}
          openNowOnly={filterOpenNow}
          setOpenNowOnly={(v: boolean) => setFilterOpenNow(v)}
          showOpenNowOption={false}
        />

      {/* Filtro por tipo (grid, igual à página de lugares) */}
      {environments.length > 0 && (
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
          <div className="mx-auto max-w-5xl px-4 sm:px-12 pb-8 text-black">
            <h3 className="font-bold text-base sm:text-lg mb-2">{t('placeList.environmentTitle') || 'Tipo de lugar:'}</h3>
            <div className="bg-[#F5F5F5] text-black pb-4">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-xs w-full">
                {/* Botão "Todos" */}
                <button
                  type="button"
                  onClick={() => {
                    setIsListFading(true);
                    setTimeout(() => { setSelectedType(null); setIsListFading(false); }, 220);
                  }}
                  className={`w-full font-semibold uppercase rounded-md px-4 py-4 leading-tight transition-colors border shadow-sm ${
                    selectedType === null ? 'bg-bs-red text-white border-bs-red' : 'bg-white text-black border-[#0F0D13]'
                  }`}
                >
                  {t('common.all')}
                </button>
                {/* Primeiros 4 tipos em mobile, 8 em desktop */}
                {environments.slice(0, 8).map((env, idx) => (
                  <button
                    key={env.value}
                    type="button"
                    onClick={() => {
                      const next = selectedType === env.value ? null : env.value;
                      setIsListFading(true);
                      setTimeout(() => { setSelectedType(next); setIsListFading(false); }, 220);
                    }}
                    className={`w-full font-semibold uppercase rounded-md px-4 py-4 leading-tight transition-colors border shadow-sm ${
                      selectedType === env.value ? 'bg-bs-red text-white border-bs-red' : 'bg-white text-black border-[#0F0D13]'
                    } ${idx >= 4 ? 'hidden sm:block' : ''}`}
                  >
                    {env.label}
                  </button>
                ))}
                {/* Botão "Ver mais" */}
                {environments.length > 4 && (
                  <ActionButton
                    type="button"
                    onClick={() => setShowEnvironmentModal(true)}
                    size="md"
                    className={`w-full py-4 font-semibold text-base rounded-md ${environments.length > 8 ? '' : 'sm:hidden'}`}
                  >
                    {t('home.viewMore')}
                  </ActionButton>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtro de ordenação */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-12 py-4 text-black">
            <div className="flex items-center justify-end">
                <div>
                    <div className="relative inline-block">
                <button
                  className="bg-bs-card text-white px-3 py-2 rounded border border-bs-red font-bold text-xs flex items-center"
                  onClick={() => setShowFiltersModal(true)}
                >
                  <img src={icFilter} alt="filter" className="w-4 h-4 mr-2 inline-block" />
                  <span>{t('filters.button')}</span>
                </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Lista de lugares (estilo igual ao de categorias) */}
      <section className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] flex-1 shadow-lg transition-opacity duration-50 ${isListFading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="mx-auto max-w-5xl px-0 sm:px-12">
          <div className="rounded-t-lg overflow-hidden">
            <div className="flex bg-bs-card text-[#F5F5F5] font-bold text-lg sm:text-[20px] leading-tight border-b-2 border-bs-red">
                <div className="w-1/3 px-4 sm:px-6 py-3">{t('list.nameHeader')}</div>
                <div className="w-1/4 py-3 ps-4 sm:ps-6">{t('list.typeHeader')}</div>
                <div className="w-1/6 py-3 ps-2">{t('placeList.opensAtHeader', { defaultValue: 'Abertura' })}</div>
            </div>
            {sortedPlaces.length === 0 && (
              <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>
            )}
                {sortedPlaces.map((place, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-[#403E44]' : 'bg-[#48464C]';
                return (
                <div
                  key={place.id}
                  className={`flex items-center ${rowBg} px-4 sm:px-6 border-b border-bs-bg text-sm sm:text-base text-[#F5F5F5]`}
                >
                  <div className="w-1/3 px-0 py-6">{place.name}</div>
                  <div className="w-1/4 px-4 py-6">{getPlaceTypeLabel(place.type)}</div>
                  <div className="w-1/6 px-4 py-6 text-sm text-gray-200">{getOpeningDisplayForToday(place)}</div>
                  <div className="flex-1 flex justify-end">
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
                        // navigate to friendly slug URL
                        navigate(`/${cat}/${slugify(place.name)}`);
                      }}
                      size="md"
                    >
                      {(() => {
                        const details = t('common.details');
                        const mobile = details.replace(' ', '\n');
                        return (
                          <>
                            <span className="sm:hidden whitespace-pre-line">{mobile}</span>
                            <span className="hidden sm:inline">{details}</span>
                          </>
                        );
                      })()}
                    </ActionButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Modal de tipos de ambiente (completo) */}
      {showEnvironmentModal && (
        <EnvironmentSelectModal
          environments={environments}
          excludedValues={environments.slice(0, 8).map(e => e.value)}
          selectedEnv={selectedType}
          onClose={() => setShowEnvironmentModal(false)}
          onSelect={(env) => {
            const next = env?.value || null;
            setIsListFading(true);
            setTimeout(() => { setSelectedType(next); setIsListFading(false); }, 220);
          }}
        />
      )}
    </div>
  );
};

// Modal de seleção completa (usado pelo botão "ver mais")
// Renderizamos o componente abaixo do return principal para manter consistência
// com a forma como é usado em PlaceListPage.
// NOTE: o modal é exibido condicionalmente via state `showEnvironmentModal`.
// A declaração do modal deve ficar antes do final do JSX retornado, mas aqui
// adicionamos como parte do componente root.
