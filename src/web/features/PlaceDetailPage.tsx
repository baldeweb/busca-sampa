import { useParams, useNavigate } from "react-router-dom";
import { slugify } from '@/core/services/Slugify';
import { PlaceDetail } from "@/web/components/place/PlaceDetail";
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
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { useMemo, useState } from "react";
import { useOpeningPatterns } from "@/web/hooks/useOpeningPatterns";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import { OpeningHoursModal } from "@/web/components/place/OpeningHoursModal";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/web/hooks/useDocumentTitle';

export function PlaceDetailPage() {
      const { t } = useTranslation();
    // Importa utilitário para verificar se está aberto agora
    // params can be legacy (id/category) or new friendly (type/slug)
    // @ts-ignore
    const { id, category, type, slug } = useParams();
    const normalizedCategory = ((category || type) || "").toLowerCase();
  const navigate = useNavigate();

  // Carrega todas as categorias
  const { data: restaurants } = useRecommendationList("restaurants");
  const { data: bars } = useRecommendationList("bars");
  const { data: coffees } = useRecommendationList("coffees");
  const { data: nightlife } = useRecommendationList("nightlife");
  const { data: nature } = useRecommendationList("nature");
  const { data: touristSpots } = useRecommendationList("tourist-spot");
  const { data: forfun } = useRecommendationList("forfun");
  const { data: stores } = useRecommendationList("stores");
  const { data: pleasures } = useRecommendationList("pleasure");

  // Junta todos os lugares
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

  function normalizeRouteType(key?: string) {
    switch ((key || '').toLowerCase()) {
      case 'restaurants':
      case 'restaurantes':
        return 'restaurants';
      case 'bars':
      case 'bares':
        return 'bars';
      case 'coffees':
      case 'cafeterias':
        return 'coffees';
      case 'nightlife':
      case 'vida-noturna':
        return 'nightlife';
      case 'nature':
      case 'natureza':
        return 'nature';
      case 'tourist-spot':
      case 'pontos-turisticos':
        return 'tourist-spot';
      case 'forfun':
      case 'diversao':
        return 'forfun';
      case 'stores':
      case 'lojas':
        return 'stores';
      case 'pleasure':
      case 'prazer':
        return 'pleasure';
      case 'free':
      case 'gratuito':
        return 'free';
      default:
        return (key || '').toLowerCase();
    }
  }

  function selectDatasetArray(key?: string) {
    switch (normalizeRouteType(key)) {
      case "restaurants": return restaurants;
      case "bars": return bars;
      case "coffees": return coffees;
      case "nightlife": return nightlife;
      case "pleasure": return pleasures;
      case "nature": return nature;
      case "tourist-spot": return touristSpots;
      case "forfun": return forfun;
      case "stores": return stores;
      default: return allPlaces;
    }
  }

  const sourceArray = selectDatasetArray(normalizedCategory);
  // Evita fallback precoce para restaurantes enquanto dados da categoria ainda carregam
  const categoryExplicita = Boolean(normalizedCategory);
  const datasetsLoading = (
    restaurants.length === 0 || bars.length === 0 || coffees.length === 0 || nightlife.length === 0 || nature.length === 0 || pleasures.length === 0 || touristSpots.length === 0 || forfun.length === 0 || stores.length === 0
  );

  const [showModal, setShowModal] = useState(false);
  const { data: patterns } = useOpeningPatterns();

  const place = useMemo(() => {
    // 1) If slug provided (friendly URL), resolve by slugified name within selected sourceArray
    if (slug) {
      const foundBySlug = sourceArray.find(p => slugify(p.name) === slug);
      if (foundBySlug) return foundBySlug;
      // If not found in explicit category, search allPlaces as fallback
      const globalFound = allPlaces.find(p => slugify(p.name) === slug);
      if (globalFound) return globalFound;
    }
    // 2) Legacy id-based routes
    if (id) {
      let found = sourceArray.find(p => String(p.id) === id);
      if (!found && !categoryExplicita) {
        found = allPlaces.find(p => String(p.id) === id);
      }
      if (found) return found;
    }
    return undefined;
  }, [sourceArray, id, slug, categoryExplicita, allPlaces]);

  const mostrandoLoading = categoryExplicita && !place && datasetsLoading;

  // Define título da aba para o lugar atual (chamado incondicionalmente para evitar hooks condicionais)
  const pageTitle = place ? `${place.name} - ${t('header.title')}` : t('header.title');
  useDocumentTitle(pageTitle);

  if (mostrandoLoading) {
    return <div className="text-center py-10">{t('placeDetail.loading')}</div>;
  }
  if (!place) {
    return <div className="text-center py-10">{t('placeDetail.notFound')}</div>;
  }

  // Monta os dados para PlaceDetail
  const mainAddress = place.addresses?.[0] || {};
  const openingDays: string[] = [];
  if (place.isOpenOnMonday) openingDays.push(t('placeDetail.opensMonday'));
  if (place.isOpenOnSundays) openingDays.push(t('placeDetail.opensSunday'));
  if (place.isOpenOnHolidays) openingDays.push(t('placeDetail.opensHoliday'));

  // Busca padrão de horários pelo patternId
  const patternId = place.openingHours?.patternId;
  const openingPattern = patterns.find(p => p.id === patternId) || null;

  const abertoAgora = openingPattern ? isOpenNow(openingPattern.periods) : false;
  // choose icon based on place.type
  const iconNode = (() => {
    const typeKey = place?.type || '';
    switch ((typeKey || '').toUpperCase()) {
      case 'BARS':
        return <img src={icBars} alt="bar" className="w-10 h-10 object-contain mr-4" />;
      case 'COFFEES':
        return <img src={icCoffee} alt="coffees" className="w-10 h-10 object-contain mr-4" />;
      case 'FREE':
        return <img src={icFree} alt="free" className="w-10 h-10 object-contain mr-4" />;
      case 'NIGHTLIFE':
        return <img src={icNightlife} alt="nightlife" className="w-10 h-10 object-contain mr-4" />;
      case 'NATURE':
        return <img src={icNature} alt="nature" className="w-10 h-10 object-contain mr-4" />;
      case 'TOURIST_SPOT':
        return <img src={icTouristSpot} alt="tourist" className="w-10 h-10 object-contain mr-4" />;
      case 'FORFUN':
        return <img src={icForfun} alt="forfun" className="w-10 h-10 object-contain mr-4" />;
      case 'STORES':
        return <img src={icStores} alt="stores" className="w-10 h-10 object-contain mr-4" />;
      case 'PLEASURE':
        return <img src={icMouth} alt="pleasure" className="w-10 h-10 object-contain mr-4" />;
      case 'RESTAURANTS':
      default:
        return <img src={icRestaurants} alt="restaurant" className="w-10 h-10 object-contain mr-4" />;
    }
  })();
  return (
    <>
      <PlaceDetail
        name={place.name}
        description={""}
        type={getPlaceTypeLabel(place.type)}
        icon={iconNode}
        priceRange={place.priceRange}
        openingDays={openingDays}
        isOpenNow={abertoAgora}
            neighborhood={mainAddress.neighborhood || ""}
            address={`${mainAddress.street || ""}, ${mainAddress.number || ""}`}
            googleMapsUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${mainAddress.street || ""}, ${mainAddress.number || ""} - ${mainAddress.neighborhood || ""} - ${mainAddress.city || ""} - SP - Brasil`)}`}
            addresses={place.addresses || []}
        instagramUrl={place.linkInstagram || ""}
        phones={place.phones || []}
        menuUrl={place.linkMenu || ""}
        websiteUrl={place.linkWebsite || ""}
        openingPatternId={openingPattern?.id || patternId || ""}
        notes={place.notes || []}
        onBack={() => navigate(-1)}
        onShowOpeningHours={() => setShowModal(true)}
            isAlreadyVisited={place.isAlreadyVisited}
      />
      <OpeningHoursModal
        pattern={openingPattern}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        customMessage={
          openingPattern?.id === 'CHECK_AVAILABILITY_DAYTIME'
            ? t('openingHours.checkAvailabilityMessage')
            : openingPattern?.id === 'ALWAYS_OPEN'
            ? t('openingHours.alwaysOpenMessage')
            : undefined
        }
      />
    </>
  );
}
