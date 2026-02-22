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

  const getOpeningText = (patternId?: string) => {
    if (!patternId) return t('openingHours.notProvided');
    if (patternId === 'CHECK_AVAILABILITY_DAYTIME') {
      return t('openingHours.checkAvailabilityLabel');
    }
    const pattern = openingPatterns.find((item) => item.id === patternId);
    return pattern?.description || t('openingHours.notProvided');
  };

  useDocumentTitle(t('footer.search'));

  function handleSearch() {
    // Placeholder for future search action.
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-white flex flex-col">
      <Toolbar onBack={() => navigate(-1)} />
      <div className="flex-1 grid" style={{ gridTemplateRows: hasResults ? 'auto 1fr' : 'auto' }}>
        <section className="relative shrink-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
          <div className="mx-auto max-w-5xl pt-0 pb-2 text-black">
            <div className="w-full bg-[#F5F5F5] border border-[#8492A6] rounded-b-[8px] px-4 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <img src={icSearch} alt="Buscar" className="w-9 h-9 object-contain mt-2" />
                <div>
                  <SectionHeading
                    title={t('searchPage.title')}
                    underline={false}
                    sizeClass="text-lg sm:text-2xl text-[#212121]"
                  />
                  <p className="text-sm text-[#212121] max-w-2xl whitespace-pre-line leading-relaxed">
                    {t('searchPage.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            <div className={`w-full px-4 sm:px-12 transition-all duration-500 ease-out ${hasResults ? 'mt-6 min-h-[120px] flex items-start' : 'mt-6 min-h-[46vh] flex items-center'}`}>
              <div className={`w-full transition-all duration-500 ease-out ${hasResults ? '-translate-y-1 opacity-100' : 'translate-y-0 opacity-100'}`}>
                <p className="mb-2 text-base font-semibold text-[#212121] pt-4">{t('searchPage.fieldLabel')}</p>
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
              <h3 className="pt-6 text-lg font-bold text-[#F5F5F5]">{t('searchPage.resultsTitle')}: {results.length}</h3>
              <div className="rounded-t-lg overflow-hidden flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                  {results.map((place) => {
                    const primaryType = getPrimaryPlaceType(place);
                    const neighborhood = place.addresses?.[0]?.neighborhood || t('list.variablePlace');
                    const openingText = getOpeningText(place.openingHours?.patternId);
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

      <ReportProblemFooter subject="Reportar um problema da página de busca" />
    </div>
  );
}
