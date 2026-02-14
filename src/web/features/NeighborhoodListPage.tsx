import React, { useMemo, useState } from "react";
import { useDocumentTitle } from '@/web/hooks/useDocumentTitle';
import { Toolbar } from '@/web/components/layout/Toolbar';
import { useParams, useNavigate } from "react-router-dom";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { slugify } from "@/core/services/Slugify";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import { useTranslation } from 'react-i18next';
import { useOpeningPatterns } from '@/web/hooks/useOpeningPatterns';
import { isOpenNow } from '@/core/domain/enums/openingHoursUtils';
import EnvironmentGrid from '@/web/components/ui/EnvironmentGrid';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { EnvironmentSelectModal } from '@/web/components/place/EnvironmentSelectModal';
import { FilterBar } from '@/web/components/ui/FilterBar';
// import { FiltersModal } from '@/web/components/place/FiltersModal';
import icNeighborhood from '@/assets/imgs/icons/ic_neighborhood.png';
import icBars from '@/assets/imgs/icons/ic_bars.png';
import icCoffee from '@/assets/imgs/icons/ic_coffee.png';
import icForfun from '@/assets/imgs/icons/ic_forfun.png';
import icNature from '@/assets/imgs/icons/ic_nature.png';
import icNightlife from '@/assets/imgs/icons/ic_nightlife.png';
import icRestaurants from '@/assets/imgs/icons/ic_restaurants.png';
import icStores from '@/assets/imgs/icons/ic_stores.png';
import icTouristSpot from '@/assets/imgs/icons/ic_tourist_spot.png';
import { PlaceListItem } from '@/web/components/place/PlaceListItem';

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
  const { data: forfun } = useRecommendationList("forfun");
  const { data: stores } = useRecommendationList("stores");
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
      ...forfun,
      ...stores,
    ],
    [restaurants, bars, coffees, nightlife, nature, pleasures, touristSpots, forfun, stores]
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
    const matches = allPlaces.filter((place) =>
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
          .replace(/[\u0300-\u036f]/g, "");
        return candidates.includes(plain);
      })
    );
    // Deduplicação defensiva por tipo+id, evitando entradas repetidas
    const byKey = new Map<string, any>();
    for (const p of matches) {
      const key = `${String(p.type)}:${String(p.id)}`;
      if (!byKey.has(key)) byKey.set(key, p);
    }
    return Array.from(byKey.values());
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
    { value: 'neighborhood-asc' },
  ];
  const [order, setOrder] = useState(ORDER_OPTIONS[0].value);
  // const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState<'any'|'required'|'not-required'>('any');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [showSortingMenu, setShowSortingMenu] = useState(false);
  const [showHoursMenu, setShowHoursMenu] = useState(false);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showPriceMenu, setShowPriceMenu] = useState(false);

  const cities = useMemo(() => {
    const s = new Set<string>();
    neighborhoodPlaces.forEach((p: any) => {
      (p.addresses || []).forEach((a: any) => { if (a && a.city) s.add(String(a.city)); });
    });
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [neighborhoodPlaces]);

  const priceOptions = useMemo(() => {
    const s = new Set<string>();
    neighborhoodPlaces.forEach((p: any) => {
      if (p?.priceRange) {
        const clean = String(p.priceRange).trim().toUpperCase();
        s.add(clean);
      }
    });
    const arr = Array.from(s);
    const ORDER: string[] = ["FREE", "ECONOMIC", "MODERATE", "EXPENSIVE"]; // requested sequence (FREE first)
    return arr.sort((a, b) => {
      const ia = ORDER.indexOf(a);
      const ib = ORDER.indexOf(b);
      if (ia !== -1 || ib !== -1) {
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      }
      return a.localeCompare(b);
    });
  }, [neighborhoodPlaces]);

  const filteredPlaces = useMemo(() => {
    const norm = (s: any) => String(s || '').trim().toLowerCase();
    
    const arr = neighborhoodPlaces.filter((p) => {
      // Filtro de tipo (case-insensitive, também considera tags)
      if (selectedType) {
        const sel = norm(selectedType);
        const typeMatches = norm(p.type) === sel;
        const tagMatches = Array.isArray(p.tags) && p.tags.some((tg: any) => norm(tg) === sel);
        if (!typeMatches && !tagMatches) return false;
      }
      
      // Filtro de agendamento
      if (scheduleFilter === 'required' && !p.shouldSchedule) return false;
      if (scheduleFilter === 'not-required' && p.shouldSchedule) return false;
      
      // Filtro de preço
      if (priceFilter && norm(p.priceRange) !== norm(priceFilter)) return false;
      
      // Filtro de cidade
      if (selectedCity) {
        const hasCity = (p.addresses || []).some((a: any) => norm(a.city) === norm(selectedCity));
        if (!hasCity) return false;
      }
      
      return true;
    });
    
    return arr;
  }, [neighborhoodPlaces, selectedType, scheduleFilter, selectedCity, priceFilter]);

  // Apply 'open now' filter if requested
  const filteredPlacesWithOpenNow = useMemo(() => {
    if (!filterOpenNow) return filteredPlaces;
    return filteredPlaces.filter(p => {
      try {
        const periods = getPeriodsForToday(p);
        return isOpenNow(periods);
      } catch (_) { return false; }
    });
  }, [filteredPlaces, filterOpenNow]);

  const getPlaceIconSrc = (type?: string) => {
    switch (type) {
      case 'BARS': return icBars;
      case 'COFFEES': return icCoffee;
      case 'NIGHTLIFE': return icNightlife;
      case 'NATURE': return icNature;
      case 'RESTAURANTS': return icRestaurants;
      case 'TOURIST_SPOT': return icTouristSpot;
      case 'FORFUN': return icForfun;
      case 'STORES': return icStores;
      default: return icNeighborhood;
    }
  };

  const sortedPlaces = useMemo(() => {
    const arr = [...filteredPlacesWithOpenNow];
    switch (order) {
      case 'name-asc':
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'neighborhood-asc':
        arr.sort((a, b) => {
          const na = a.addresses?.[0]?.neighborhood || a.neighborhood || '';
          const nb = b.addresses?.[0]?.neighborhood || b.neighborhood || '';
          return na.localeCompare(nb);
        });
        break;
    }
    return arr;
  }, [filteredPlacesWithOpenNow, order]);

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
    if (!periods || periods.length === 0) {
      // No periods today — scan the next 7 days and return the first upcoming opening.
      try {
        const now = new Date();
        for (let offset = 1; offset <= 7; offset++) {
          const futurePeriods = getPeriodsForDay(place, offset);
          if (!futurePeriods || futurePeriods.length === 0) continue;

          let earliest: string | null = null;
          function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
          for (const p of futurePeriods) {
            if (!p.open) continue;
            if (earliest === null || parseTime(p.open) < parseTime(earliest)) earliest = p.open;
          }
          if (earliest) {
            if (offset === 1) return t('placeList.opensTomorrowAt', { time: earliest, defaultValue: `Abre amanhã às ${earliest}` });
            const weekdaysPt = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
            const weekday = weekdaysPt[(now.getDay() + offset) % 7];
            return t('placeList.opensOnAt', { day: weekday, time: earliest, defaultValue: `Abre ${weekday} às ${earliest}` });
          }
        }
      } catch (e) {
        console.warn('[getOpeningDisplayForToday] future scan failed for place id=', place?.id, e);
      }
      return '-';
    }

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

    // No more openings today — attempt a robust next-opening search across the next 7 days.
    // If the next opening is tomorrow, return the localized "Abre amanhã às XXX".
    try {
      for (let offset = 1; offset <= 7; offset++) {
        const futurePeriods = getPeriodsForDay(place, offset);
        if (!futurePeriods || futurePeriods.length === 0) continue;

        // find earliest opening in that future day
        let earliest: string | null = null;
        function parseTime2(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
        for (const p of futurePeriods) {
          if (!p.open) continue;
          if (earliest === null || parseTime2(p.open) < parseTime2(earliest)) earliest = p.open;
        }
        if (earliest) {
          if (offset === 1) return t('placeList.opensTomorrowAt', { time: earliest, defaultValue: `Abre amanhã às ${earliest}` });
          const weekdaysPt = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
          const weekday = weekdaysPt[(now.getDay() + offset) % 7];
          return t('placeList.opensOnAt', { day: weekday, time: earliest, defaultValue: `Abre ${weekday} às ${earliest}` });
        }
      }
    } catch (e) {
      console.warn('[getOpeningDisplayForToday] next-opening search failed for place id=', place?.id, e);
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
      <Toolbar onBack={() => navigate(-1)} />
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl px-0 sm:px-12 pt-0 pb-2 text-black">
            <div className="w-full bg-[#F5F5F5] border border-[#8492A6] rounded-b-[8px] px-4 py-8">
              <div className="flex items-start gap-4">
                <img src={icNeighborhood} alt="neighborhood" className="w-12 h-12 object-contain" />
                <div>
                  <SectionHeading title={titleNeighborhood} underline={false} sizeClass="text-lg sm:text-2xl text-[#48464C]" />
                  <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{t('neighborhoodList.intro')}</p>
                </div>
              </div>
            </div>
        </div>
      </section>

        {/* Inline filters replace the old FiltersModal */}

      {/* Filtro por tipo (grid, igual à página de lugares) */}
      {environments.length > 0 && (
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
          <div className="mx-auto max-w-5xl sm:px-12 pb-3 text-black">
            <EnvironmentGrid
              environments={environments}
              selectedEnv={selectedType}
              onSelect={(value) => {
                setIsListFading(true);
                setTimeout(() => {
                  setSelectedType(value);
                  setIsListFading(false);
                }, 220);
              }}
              onViewMore={() => setShowEnvironmentModal(true)}
            />
          </div>
        </section>
      )}

      <FilterBar
        orderOptions={ORDER_OPTIONS}
        order={order}
        onOrderSelect={(value) => setOrder(value)}
        filterOpenNow={filterOpenNow}
        onSelectOpenNow={() => setFilterOpenNow(true)}
        onSelectAnyHour={() => setFilterOpenNow(false)}
        scheduleFilter={scheduleFilter}
        onSelectSchedule={(value) => setScheduleFilter(value)}
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={(value) => setSelectedCity(value)}
        priceOptions={priceOptions}
        priceFilter={priceFilter}
        onSelectPrice={(value) => setPriceFilter(value)}
        showSortingMenu={showSortingMenu}
        setShowSortingMenu={setShowSortingMenu}
        showHoursMenu={showHoursMenu}
        setShowHoursMenu={setShowHoursMenu}
        showScheduleMenu={showScheduleMenu}
        setShowScheduleMenu={setShowScheduleMenu}
        showCityMenu={showCityMenu}
        setShowCityMenu={setShowCityMenu}
        showPriceMenu={showPriceMenu}
        setShowPriceMenu={setShowPriceMenu}
        openNowLabelKey="filters.openNow"
        openNowLabelDefault="Aberto agora"
        anyHourLabelKey="filters.anyHour"
        anyHourLabelDefault="Qualquer horário"
        showCityFilter={cities.length > 1}
        showPriceFilter={priceOptions.length >= 1}
      />

      {/* Lista de lugares (estilo igual ao de categorias) */}
      <section className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] flex-1 shadow-lg transition-opacity duration-50 ${isListFading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="mx-auto max-w-5xl px-4 sm:px-12">
          <div className="rounded-t-lg overflow-hidden">
            {sortedPlaces.length === 0 && (
              <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>
            )}
            {sortedPlaces.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                {sortedPlaces.map((place) => {
                  const neighborhood = place.addresses?.[0]?.neighborhood || place.neighborhood || '';
                  const openingText = ['CHECK_AVAILABILITY_DAYTIME'].includes(place.openingHours?.patternId)
                    ? t('openingHours.checkAvailabilityLabel')
                    : getOpeningDisplayForToday(place);
                  return (
                    <PlaceListItem
                      key={`${String(place.type)}:${String(place.id)}`}
                      variant="neighborhood"
                      name={place.name}
                      neighborhood={neighborhood || t('list.variablePlace')}
                      openingText={openingText}
                      iconSrc={getPlaceIconSrc(place.type)}
                      detailsLabel={t('common.details')}
                      onDetails={() => {
                        const typeMap: Record<string, string> = {
                          RESTAURANTS: "restaurantes",
                          BARS: "bares",
                          COFFEES: "cafeterias",
                          NIGHTLIFE: "vida-noturna",
                          NATURE: "natureza",
                          TOURIST_SPOT: "pontos-turisticos",
                          FORFUN: "diversao",
                          STORES: "lojas",
                          PLEASURE: "prazer",
                          FREE: "gratuito",
                        };
                        const cat = typeMap[place.type] || "restaurantes";
                        navigate(`/${cat}/${slugify(place.name)}`);
                      }}
                    />
                  );
                })}
              </div>
            )}
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
            setTimeout(() => {
              setSelectedType(next);
              setIsListFading(false);
            }, 220);
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
