import { useParams, useNavigate } from "react-router-dom";
import { PlaceDetail } from "@/web/components/place/PlaceDetail";
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
    // @ts-ignore
  const { id, category } = useParams();
  const normalizedCategory = (category || "").toLowerCase();
  const navigate = useNavigate();

  // Carrega todas as categorias
  const { data: restaurants } = useRecommendationList("restaurants");
  const { data: bars } = useRecommendationList("bars");
  const { data: coffees } = useRecommendationList("coffees");
  const { data: nightlife } = useRecommendationList("nightlife");
  const { data: nature } = useRecommendationList("nature");
  const { data: touristSpots } = useRecommendationList("tourist-spot");

  // Junta todos os lugares
  const allPlaces = useMemo(() => [
    ...restaurants,
    ...bars,
    ...coffees,
    ...nightlife,
    ...nature,
    ...touristSpots,
  ], [restaurants, bars, coffees, nightlife, nature, touristSpots]);

  function selectDatasetArray(key?: string) {
    switch (key) {
      case "restaurants": return restaurants;
      case "bars": return bars;
      case "coffees": return coffees;
      case "nightlife": return nightlife;
      case "nature": return nature;
      case "tourist-spot": return touristSpots;
      default: return allPlaces;
    }
  }

  const sourceArray = selectDatasetArray(normalizedCategory);
  // Evita fallback precoce para restaurantes enquanto dados da categoria ainda carregam
  const categoryExplicita = Boolean(normalizedCategory);
  const datasetsLoading = (
    restaurants.length === 0 || bars.length === 0 || coffees.length === 0 || nightlife.length === 0 || nature.length === 0 || touristSpots.length === 0
  );

  const [showModal, setShowModal] = useState(false);
  const { data: patterns } = useOpeningPatterns();

  const place = useMemo(() => {
    let found = sourceArray.find(p => String(p.id) === id);
    if (!found && !categoryExplicita) {
      // Apenas se rota legacy sem categoria
      found = allPlaces.find(p => String(p.id) === id);
    }
    return found;
  }, [sourceArray, id, categoryExplicita, allPlaces]);

  const mostrandoLoading = categoryExplicita && !place && datasetsLoading;

  if (mostrandoLoading) {
    return <div className="text-center py-10">{t('placeDetail.loading')}</div>;
  }
  if (!place) {
    return <div className="text-center py-10">{t('placeDetail.notFound')}</div>;
  }

  // Define título da aba para o lugar atual
  useDocumentTitle(`${place.name} - ${t('header.title')}`);

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
  return (
    <>
      <PlaceDetail
        name={place.name}
        description={""}
        type={getPlaceTypeLabel(place.type)}
        priceRange={place.priceRange}
        openingDays={openingDays}
        isOpenNow={abertoAgora}
        neighborhood={mainAddress.neighborhood || ""}
        address={`${mainAddress.street || ""}, ${mainAddress.number || ""}`}
        googleMapsUrl={`https://maps.google.com/?q=${mainAddress.street || ""},${mainAddress.number || ""}`}
        instagramUrl={place.linkInstagram || ""}
        menuUrl={place.linkMenu || ""}
        notes={place.notes || []}
        onBack={() => navigate(-1)}
        onShowOpeningHours={() => setShowModal(true)}
            isAlreadyVisited={place.isAlreadyVisited}
      />
      <OpeningHoursModal
        pattern={openingPattern}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        instagramUrl={place.linkInstagram}
      />
    </>
  );
}
