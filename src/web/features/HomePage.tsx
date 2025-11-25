import { useEffect, useState } from "react";
import { WhereIsTodayMenu } from "@/web/components/home/WhereIsTodayMenu";
import type { MenuWhereIsTodayOption } from '@/core/domain/models/MenuWhereIsTodayOption';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { ActionButton } from '@/web/components/ui/ActionButton';
import { useDocumentTitle } from '@/web/hooks/useDocumentTitle';
import { NeighborhoodSelectModal } from "@/web/components/home/NeighborhoodSelectModal";
import { DistanceSelectModal } from "@/web/components/home/DistanceSelectModal";

import { useNeighborhoodList } from "@/web/hooks/useNeighborhoodList";

import type { Neighborhood } from "@/core/domain/models/Neighborhood";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/core/services/Slugify";
import { distanceInKm, formatDistanceKm } from "@/core/services/Distance";
import { fetchRecommendations } from "@/data/repositories/RecommendationRepository";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";
import { NearbyMapModal } from "@/web/components/home/NearbyMapModal";

export function HomePage() {
  // 🔹 Carrega todas as categorias
  const DEFAULT_RADIUS_DISTANCE = 5
  const { data: neighborhoods } = useNeighborhoodList();

  // 🔹 Controles de UI
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [isDistanceModalOpen, setIsDistanceModalOpen] = useState(false);

  // Estado de bairro não é mais necessário: navegação direta
  // Distância (raio) selecionada em KM (parametrizável)
  const [selectedDistance, setSelectedDistance] = useState(DEFAULT_RADIUS_DISTANCE);

  // Localização do usuário
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Dados de todas as categorias para cálculo de proximidade
  const CATEGORY_CODES = ["restaurants", "bars", "nightlife", "coffees", "tourist-spot"] as const;
  const [allCategoryData, setAllCategoryData] = useState<Record<string, PlaceRecommendation[]>>({});
  const [loadingNearby, setLoadingNearby] = useState(false);

  // Estatísticas de proximidade
  const [nearbyStats, setNearbyStats] = useState<
    {
      category: string;
      label: string;
      count: number;
      nearestKm: number | null;
      nearestLat?: number;
      nearestLng?: number;
      nearestName?: string;
      withinRadius: PlaceRecommendation[];
    }[]
  >([]);
  const [mapCategory, setMapCategory] = useState<string | null>(null);
  const CACHE_KEY = "bs_geolocation";

  // Estado de opção 'onde é hoje?' não usado nesta versão

  // 🔹 Lista completa combinada (todos os lugares)
  // (Lista completa removida - não utilizada nesta tela após refatoração)

  // 🔹 Aplica filtros selecionados
  // Filtros removidos (logica migrada para páginas dedicadas)

  const navigate = useNavigate();
  function handleWhereIsTodaySelect(option: MenuWhereIsTodayOption) {
    // Caso especial: a opção 'Aberto agora' deve navegar para /list/aberto-agora
    // normaliza título removendo zero-width spaces e comparando em lower-case
    const rawTitle = (option.title || '').replace(/\u200B/g, '').trim();
    const title = rawTitle.toLowerCase();
    if (title === 'aberto agora' || title === 'aberto-agora') {
      navigate('/list/aberto-agora', { state: { label: rawTitle } });
      return;
    }
    // Para as demais opções usamos a primeira tag para navegar (ex: 'RESTAURANTS')
    const tag = option.tags && option.tags.length > 0 ? option.tags[0].toLowerCase() : 'restaurants';
    navigate(`/list/${tag}`, { state: { label: rawTitle } });
  }

  function handleNeighborhoodSelect(n: Neighborhood) {
    // Em vez de apenas selecionar, navegamos para a página dedicada do bairro
    const s = slugify(n.neighborhoodName);
    navigate(`/neighborhood/${s}`);
  }

  function handleDistanceConfirm(n: number) {
    setSelectedDistance(n);
  }

  function requestUserLocation(force?: boolean) {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não suportada");
      return;
    }
    if (!force) {
      // tenta usar cache se existir
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.latitude && parsed.longitude && parsed.timestamp) {
            setUserLocation({ latitude: parsed.latitude, longitude: parsed.longitude });
            return; // já restaurou do cache
          }
        } catch (_) { }
      }
    }
    setIsRequestingLocation(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        const payload = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        setIsRequestingLocation(false);
      },
      (err) => {
        setGeoError(err.message);
        setIsRequestingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Carrega categorias quando temos localização (para evitar requisição desnecessária)
  useEffect(() => {
    if (!userLocation) return;
    let isMounted = true;
    setLoadingNearby(true);
    Promise.all(
      CATEGORY_CODES.map(async (c) => {
        const data = await fetchRecommendations(c);
        return { c, data };
      })
    )
      .then((results) => {
        if (!isMounted) return;
        const map: Record<string, PlaceRecommendation[]> = {};
        results.forEach((r) => (map[r.c] = r.data));
        setAllCategoryData(map);
      })
      .catch((e) => {
        console.error("Erro ao carregar categorias para proximidade", e);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingNearby(false);
      });
    return () => {
      isMounted = false;
    };
  }, [userLocation]);

  // Recalcula estatísticas quando mudam localização, raio ou dados
  useEffect(() => {
    if (!userLocation || Object.keys(allCategoryData).length === 0) {
      setNearbyStats([]);
      return;
    }
    const stats: {
      category: string;
      label: string;
      count: number;
      nearestKm: number | null;
      nearestLat?: number;
      nearestLng?: number;
      nearestName?: string;
      withinRadius: PlaceRecommendation[];
    }[] = [];
    const radius = selectedDistance; // km
    CATEGORY_CODES.forEach((code) => {
      const places = allCategoryData[code] || [];
      let count = 0;
      let nearest: number | null = null;
      let nearestLat: number | undefined;
      let nearestLng: number | undefined;
      let nearestName: string | undefined;
      const withinRadius: PlaceRecommendation[] = [];
      places.forEach((p) => {
        const mainAddress = p.addresses?.find((a) => a.isMainUnity) || p.addresses?.[0];
        if (!mainAddress || !mainAddress.latitude || !mainAddress.longitude) return;
        if (mainAddress.latitude === 0 || mainAddress.longitude === 0) return;
        const d = distanceInKm(
          userLocation.latitude,
          userLocation.longitude,
          mainAddress.latitude,
          mainAddress.longitude
        );
        if (d <= radius) {
          count += 1;
          withinRadius.push(p);
        }
        if (nearest === null || d < nearest) {
          nearest = d;
          nearestLat = mainAddress.latitude;
          nearestLng = mainAddress.longitude;
          nearestName = p.name;
        }
      });
      stats.push({
        category: code,
        label: getPlaceTypeLabel(code.toUpperCase().replace(/-/g, "_") as any),
        count,
        nearestKm: nearest,
        nearestLat,
        nearestLng,
        nearestName,
        withinRadius,
      });
    });
    // Ordena por menor distância (nearestKm) ignorando nulls enviados para o fim
    stats.sort((a, b) => {
      if (a.nearestKm === null) return 1;
      if (b.nearestKm === null) return -1;
      return a.nearestKm - b.nearestKm;
    });
    setNearbyStats(stats);
  }, [userLocation, selectedDistance, allCategoryData]);

  // Indica que não há resultados próximos a partir dos dados carregados
  const noNearbyResults = !loadingNearby && nearbyStats.filter((s) => s.count > 0).length === 0;

  // Inicializa tentando restaurar cache
  useEffect(() => {
    requestUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation();
  useDocumentTitle(t('header.title'));
  return (
    <div>
      {/* Seção: E aí, onde é hoje? */}
      <WhereIsTodayMenu onOptionSelect={handleWhereIsTodaySelect} />

      {/* Seção: Perto de mim */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[3px] bg-[#B3261E]" />
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#2B2930] py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-4">
          <div className="flex items-start justify-between">
            <div>
              <SectionHeading title={t('home.nearMeTitle')} underline={false} sizeClass="text-lg sm:text-xl" className="mb-1" />
              <p className="mt-1 text-sm text-gray-300">{t('home.nearMeSubtitle', { km: selectedDistance })}</p>
            </div>
            {userLocation && !noNearbyResults && (
              <div className="ml-4">
                <button
                  type="button"
                  onClick={() => setIsDistanceModalOpen(true)}
                  className="min-w-[140px] rounded-full border border-white/25 px-3 py-1 text-sm sm:px-4 sm:py-2 hover:border-bs-red"
                >
                  {t('common.changeDistance')}
                </button>
              </div>
            )}
          </div>
          {/* Placeholder quando não há localização */}
          {!userLocation && (
            <div className="mt-6 flex flex-col items-center text-center text-xs">
              <p className="max-w-xs text-lg text-gray-300 leading-relaxed mb-4">
                {t('home.allowLocation')}
              </p>
              <button
                type="button"
                onClick={() => requestUserLocation(true)}
                disabled={isRequestingLocation}
                className="w-72 max-w-full rounded-md bg-bs-red px-4 py-3 text-[0.75rem] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
              >
                {isRequestingLocation ? "Localizando..." : "Permitir localização"}
              </button>
              {geoError && !geoError.includes("User denied Geolocation") && (
                <p className="mt-3 text-[0.65rem] text-red-400">{geoError}</p>
              )}
            </div>
          )}
          {/* Controles e resultados quando há localização */}
          {userLocation && (
            <div className="mt-2 flex flex-col gap-2 text-xs text-gray-300">
              <div className="mt-3 space-y-2">
                {loadingNearby && (
                  <p className="text-lg text-gray-300">{t('home.loadingCategories')}</p>
                )}
                {!loadingNearby && noNearbyResults && (
                  <div className="text-center text-md text-gray-300 flex flex-col items-center gap-5 py-6">
                    <p>{t('home.noNearbyResultsRadius')}</p>
                    <ActionButton
                      type="button"
                      onClick={() => setIsDistanceModalOpen(true)}
                      size="md"
                      className="px-4"
                    >
                      {t('common.changeDistance')}
                    </ActionButton>
                  </div>
                )}
                {!loadingNearby &&
                  nearbyStats
                    .filter((s) => s.count > 0)
                    .map((s) => (
                      <div
                        key={s.category}
                        className="border-b border-white/10 py-4 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex flex-col me-6">
                          <span className="font-bold uppercase text-md">
                            {s.count} {s.label}
                          </span>
                          {s.nearestKm !== null && (
                            <span className="text-sm text-gray-400">
                              Mais próximo: {formatDistanceKm(s.nearestKm)}
                              {s.nearestName ? ` - ${s.nearestName}` : ""}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setMapCategory(s.category)}
                          className="min-w-[110px] text-sm rounded-full border border-white/25 px-3 py-1 hover:border-bs-red"
                        >
                          ver no mapa
                        </button>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>{/* /wrapper Perto de mim */}
      </section>

      {/* Seção: Por bairro (grid 2x4 retangular) */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[3px] bg-[#B3261E]" />
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-4">
          <SectionHeading title={t('home.neighborhoodsTitle')} subtitle={t('home.neighborhoodsTagline')} sizeClass="text-xl sm:text-2xl" className="mb-6" underline={false} />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs w-full">
            {neighborhoods.slice(0, 7).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleNeighborhoodSelect(n)}
                className="w-full bg-[#F5F5F5] text-black font-semibold uppercase tracking-[0.04em] rounded-[2px] px-4 py-4 leading-tight transition-colors"
              >
                {n.neighborhoodName}
              </button>
            ))}
            <ActionButton
              type="button"
              onClick={() => setIsNeighborhoodModalOpen(true)}
              size="md"
              className="w-full py-4 font-semibold text-base rounded-[2px]"
            >
              {t('home.viewMoreNeighborhoods')}
            </ActionButton>
          </div>
        </div>{/* /wrapper Por bairro */}
      </section>

      {/* Modal de seleção de bairro */}
      {isNeighborhoodModalOpen && (
        <NeighborhoodSelectModal
          neighborhoods={neighborhoods}
          onClose={() => setIsNeighborhoodModalOpen(false)}
          onSelect={handleNeighborhoodSelect}
        />
      )}
      {/* Modal de distância */}
      {isDistanceModalOpen && (
        <DistanceSelectModal
          initialKm={selectedDistance}
          onClose={() => setIsDistanceModalOpen(false)}
          onConfirm={handleDistanceConfirm}
        />
      )}
      {mapCategory && userLocation && (
        <NearbyMapModal
          onClose={() => setMapCategory(null)}
          userLocation={userLocation}
          places={nearbyStats.find((s) => s.category === mapCategory)?.withinRadius || []}
          title={getPlaceTypeLabel(mapCategory.toUpperCase().replace(/-/g, "_") as any)}
        />
      )}
    </div>
  );
}