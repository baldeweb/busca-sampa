import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { SearchField } from '@/web/components/ui/SearchField';
import { useDocumentTitle } from '@/web/hooks/useDocumentTitle';
import { Toolbar } from '@/web/components/layout/Toolbar';
import { useNavigate } from 'react-router-dom';
import { useRecommendationList } from '@/web/hooks/useRecommendationList';
import { useOpeningPatterns } from '@/web/hooks/useOpeningPatterns';
import { PlaceListItem } from '@/web/components/place/PlaceListItem';
import { slugify } from '@/core/services/Slugify';
import flagSp from '@/assets/imgs/etc/logo-role-paulista.png';
import icBars from '@/assets/imgs/icons/ic_bars.png';
import icCoffee from '@/assets/imgs/icons/ic_coffee.png';
import icFree from '@/assets/imgs/icons/ic_free.png';
import icNightlife from '@/assets/imgs/icons/ic_nightlife.png';
import icNature from '@/assets/imgs/icons/ic_nature.png';
import icRestaurants from '@/assets/imgs/icons/ic_restaurants.png';
import icTouristSpot from '@/assets/imgs/icons/ic_tourist_spot.png';
import icForfun from '@/assets/imgs/icons/ic_forfun.png';
import icStores from '@/assets/imgs/icons/ic_stores.png';
import icMouth from '@/assets/imgs/icons/ic_mouth.png';
import icSearch from '@/assets/imgs/icons/ic_search.png';
import { ReportProblemFooter } from '@/web/components/layout/ReportProblemFooter';
import { getPrimaryPlaceType } from '@/core/domain/models/PlaceRecommendation';
import { AppText } from "@/web/components/ui/AppText";
import { isOpenNow } from '@/core/domain/enums/openingHoursUtils';
import type { PlaceRecommendation } from '@/core/domain/models/PlaceRecommendation';
import type { OpeningPattern, OpeningPeriod } from '@/core/domain/models/OpeningPattern';
import type { Period } from '@/web/components/place/OpeningHoursModal';

export function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data: restaurants } = useRecommendationList('restaurants');
  const { data: bars } = useRecommendationList('bars');
  const { data: coffees } = useRecommendationList('coffees');
  const { data: nightlife } = useRecommendationList('nightlife');
  const { data: nature } = useRecommendationList('nature');
  const { data: pleasures } = useRecommendationList('pleasure');
  const { data: touristSpots } = useRecommendationList('tourist-spot');
  const { data: forfun } = useRecommendationList('forfun');
  const { data: stores } = useRecommendationList('stores');
  const { data: openingPatternsData } = useOpeningPatterns();
  const openingPatterns = openingPatternsData || [];

  const allPlaces = useMemo(() => [
    ...restaurants,
    ...bars,
    ...coffees,
    ...nightlife,
    ...nature,
    ...pleasures,
    ...touristSpots,
    ...forfun,
    ...stores,
  ], [restaurants, bars, coffees, nightlife, nature, pleasures, touristSpots, forfun, stores]);

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedQueryKey = normalizedQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const results = useMemo(() => {
    if (!normalizedQueryKey) return [];
    return allPlaces.filter((place) => {
      const primaryType = getPrimaryPlaceType(place);
      if (primaryType === 'PLEASURE') return false;
      const nameKey = place.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return nameKey.includes(normalizedQueryKey);
    });
  }, [allPlaces, normalizedQueryKey]);
  const hasResults = normalizedQuery.length > 0 && results.length > 0;

  const getPlaceIconSrc = (type?: string) => {
    switch (type) {
      case 'FREE': return icFree;
      case 'BARS': return icBars;
      case 'COFFEES': return icCoffee;
      case 'NIGHTLIFE': return icNightlife;
      case 'NATURE': return icNature;
      case 'RESTAURANTS': return icRestaurants;
      case 'TOURIST_SPOT': return icTouristSpot;
      case 'FORFUN': return icForfun;
      case 'STORES': return icStores;
      case 'PLEASURE': return icMouth;
      default: return flagSp;
    }
  };

  function getPeriodsForDay(
    place: PlaceRecommendation,
    patterns: OpeningPattern[],
    dayOffset = 0,
  ): OpeningPeriod[] {
    const periods: OpeningPeriod[] = [];
    const patternId = place.openingHours?.patternId;
    if (patternId) {
      const pat = (patterns || []).find((p) => p.id === patternId);
      if (pat?.periods) periods.push(...pat.periods);
    }
    const custom = place.openingHours?.customOverrides;
    if (Array.isArray(custom)) {
      periods.push(...(custom as OpeningPeriod[]));
    }

    const now = new Date();
    const dayNames = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ] as const;
    const targetDay = dayNames[(now.getDay() + dayOffset) % 7];
    return periods.filter((p) => Boolean(p.open) && (p.days?.includes(targetDay) || p.days?.includes('EVERYDAY')));
  }

  function getOpeningDisplayForToday(place: PlaceRecommendation, patterns: OpeningPattern[]): string {
    if (place?.openingHours?.patternId === 'ALWAYS_OPEN') {
      return t('openingHours.alwaysOpenLabel', { defaultValue: 'Sempre aberto' });
    }

    // If there is no patternId and no custom overrides, explicitly show 'hours unavailable'
    if (!place.openingHours?.patternId && (!place.openingHours?.customOverrides || place.openingHours.customOverrides.length === 0)) {
      return t('placeList.hoursUnavailable', { defaultValue: 'Horário indisponível' });
    }

    const periods = getPeriodsForDay(place, patterns, 0);
    if (!periods || periods.length === 0) {
      // No periods today — scan next 7 days for next opening
      try {
        const now = new Date();
        for (let offset = 1; offset <= 7; offset++) {
          const futurePeriods = getPeriodsForDay(place, patterns, offset);
          if (!futurePeriods || futurePeriods.length === 0) continue;

          let earliest: string | null = null;
          const parseTime = (str: string) => {
            const [h, m] = (str || '0:0').split(':').map(Number);
            return h * 60 + (m || 0);
          };
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
    try {
      if (isOpenNow(periods as unknown as Period[])) {
        return t('placeList.openNow', { defaultValue: 'Aberto agora' });
      }
    } catch {
      // ignore
    }

    // compute next opening time today
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const parseTime = (str: string) => {
      const [h, m] = (str || '0:0').split(':').map(Number);
      return h * 60 + (m || 0);
    };

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
      return t('placeList.opensAt', { time: nextOpenStr, defaultValue: `Abre às ${nextOpenStr}` });
    }

    // No more openings today — search next 7 days
    try {
      for (let offset = 1; offset <= 7; offset++) {
        const futurePeriods = getPeriodsForDay(place, patterns, offset);
        if (!futurePeriods || futurePeriods.length === 0) continue;

        let earliest: string | null = null;
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
      console.warn('[getOpeningDisplayForToday] next-opening search failed for place id=', place?.id, e);
    }

    return '-';
  }

  useDocumentTitle(t('footer.search'));

  function handleSearch() {
    // Placeholder for future search action.
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Toolbar onBack={() => navigate(-1)} />
      <div className="flex-1 grid" style={{ gridTemplateRows: hasResults ? 'auto 1fr' : 'auto' }}>
        <section className="relative shrink-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
          <div className="mx-auto max-w-5xl px-0 sm:px-12 pt-0 pb-2 text-black">
            <SectionHeading
              title={t('searchPage.title')}
              subtitle={t('searchPage.subtitle')}
              underline={false}
              leadingIcon={<img src={icSearch} alt={t('footer.search')} className="w-9 h-9 object-contain mt-2" />}
            >
            </SectionHeading>
            <div className={`w-full px-4 sm:px-0 transition-all duration-500 ease-out ${hasResults ? 'mt-6 min-h-[120px] flex items-start' : 'mt-6 min-h-[46vh] flex items-center'}`}>
              <div className={`w-full transition-all duration-500 ease-out ${hasResults ? '-translate-y-1 opacity-100' : 'translate-y-0 opacity-100'}`}>
                <AppText variant="title-light" className="mb-2 pt-4">
                  {t('searchPage.fieldLabel')}
                </AppText>
                <SearchField
                  value={query}
                  onChange={setQuery}
                  onSearch={handleSearch}
                  placeholder={t('searchPage.placeholder')}
                />
              </div>
            </div>
          </div>
        </section>
        {hasResults && (
          <section className="relative h-full left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#212121] shadow-lg transition-all duration-500 ease-out opacity-100 translate-y-0 pb-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-12 h-full min-h-full flex flex-col">
              <AppText variant="subtitle-dark" className="pt-6">
                  {t('searchPage.resultsTitle')}: {results.length}
              </AppText>
              <div className="rounded-t-lg overflow-hidden flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                  {results.map((place) => {
                    const primaryType = getPrimaryPlaceType(place);
                    const neighborhood = place.addresses?.[0]?.neighborhood || t('list.variablePlace');
                    const openingText = (place.openingHours?.patternId === 'CHECK_AVAILABILITY_DAYTIME')
                      ? t('openingHours.checkAvailabilityLabel')
                      : getOpeningDisplayForToday(place, openingPatterns);
                    return (
                      <PlaceListItem
                        key={`${String(primaryType || 'UNSET')}:${String(place.id)}`}
                        name={place.name}
                        neighborhood={neighborhood}
                        openingText={openingText}
                        iconSrc={getPlaceIconSrc(primaryType)}
                        detailsLabel={t('common.details')}
                        onDetails={() => {
                          const typeMap: Record<string, string> = {
                            RESTAURANTS: 'restaurantes',
                            BARS: 'bares',
                            COFFEES: 'cafeterias',
                            NIGHTLIFE: 'vida-noturna',
                            NATURE: 'natureza',
                            TOURIST_SPOT: 'pontos-turisticos',
                            FORFUN: 'diversao',
                            STORES: 'lojas',
                            PLEASURE: 'prazer',
                            FREE: 'gratuito',
                          };
                          const cat = typeMap[primaryType || ''] || 'restaurantes';
                          navigate(`/${cat}/${slugify(place.name)}`);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <ReportProblemFooter subject={`${t('placeDetail.reportProblem')} - ${t('searchPage.title')}`} />
    </div>
  );
}
