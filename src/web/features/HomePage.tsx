import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { WhereIsTodayMenu } from "@/web/components/home/WhereIsTodayMenu";
import type { MenuWhereIsTodayOption } from '@/core/domain/models/MenuWhereIsTodayOption';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { AppText } from '@/web/components/ui/AppText';
import { useDocumentTitle } from '@/web/hooks/useDocumentTitle';
import { NeighborhoodSelectModal } from "@/web/components/home/NeighborhoodSelectModal";
import { DistanceSelectModal } from "@/web/components/home/DistanceSelectModal";

import { useNeighborhoodList } from "@/web/hooks/useNeighborhoodList";

import type { Neighborhood } from "@/core/domain/models/Neighborhood";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/core/services/Slugify";
import { distanceInKm, formatDistanceKm } from "@/core/services/Distance";
import { fetchRecommendations } from "@/data/repositories/RecommendationRepository";
import { getPlaceTypeLabel, getPlaceTypeLabelSingular } from "@/core/domain/enums/placeTypeLabel";
import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";
import imgMuseuIpiranga640 from "@/assets/imgs/background/img_museu_ipiranga_640.webp";
import imgMuseuIpiranga1280 from "@/assets/imgs/background/img_museu_ipiranga_1280.webp";
import imgPaulista640 from "@/assets/imgs/background/img_paulista_640.webp";
import imgPaulista1280 from "@/assets/imgs/background/img_paulista_1280.webp";
import { AppButton } from "../components/ui/AppButton";

const NearbyMapModal = lazy(() => import("@/web/components/home/NearbyMapModal").then((m) => ({ default: m.NearbyMapModal })));

export function HomePage() {
  // 🔹 Carrega todas as categorias
  const DEFAULT_RADIUS_DISTANCE = 8
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
  const CATEGORY_CODES = ["restaurants", "bars", "nightlife", "coffees", "tourist-spot", "forfun", "stores"] as const;
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
  // Não usar cache de localização — sempre solicitar posição atual

  // Estado de opção 'onde é hoje?' não usado nesta versão

  // 🔹 Lista completa combinada (todos os lugares)
  // (Lista completa removida - não utilizada nesta tela após refatoração)

  // 🔹 Aplica filtros selecionados
  // Filtros removidos (logica migrada para páginas dedicadas)

  const navigate = useNavigate();
  function handleWhereIsTodaySelect(option: MenuWhereIsTodayOption) {
    const rawTitle = (option.title || '').replace(/\u200B/g, '').trim();
    const title = rawTitle.toLowerCase();
    const normalizedTags = (option.tags || [])
      .map((t) => String(t || '').trim())
      .filter(Boolean)
      .map((t) => t.replace(/-/g, '_').toUpperCase());

    if (title === 'abrem hoje' || title === 'abrem-hoje' || normalizedTags.includes('OPEN_TODAY')) {
      navigate('/abrem-hoje', { state: { label: rawTitle } });
      return;
    }

    const tagToRouteSlug = (tag: string): string => {
      const t = tag.replace(/-/g, '_').toUpperCase();
      const map: Record<string, string> = {
        RESTAURANT: 'restaurantes',
        RESTAURANTS: 'restaurantes',
        BARS: 'bares',
        COFFEES: 'cafeterias',
        NIGHTLIFE: 'vida-noturna',
        NATURE: 'natureza',
        TOURIST_SPOT: 'pontos-turisticos',
        FORFUN: 'diversao',
        STORES: 'lojas',
        PLEASURE: 'prazer',
        FREE: 'gratuito'
      };
      return map[t] || t.toLowerCase().replace(/_/g, '-');
    };

    const firstTag = normalizedTags[0] || 'RESTAURANTS';
    const slug = tagToRouteSlug(firstTag);
    navigate(`/${slug}`, { state: { label: rawTitle } });
  }

  function handleNeighborhoodSelect(n: Neighborhood) {
    // Em vez de apenas selecionar, navegamos para a página dedicada do bairro
    const s = slugify(n.neighborhoodName);
    navigate(`/bairro/${s}`);
  }

  function handleDistanceConfirm(n: number) {
    setSelectedDistance(n);
  }

  // no-op cleanup kept for parity (no refs used anymore)



  // Carrega categorias quando temos localização (para evitar requisição desnecessária)
  useEffect(() => {
    if (!userLocation) return;
    let isMounted = true;
    setLoadingNearby(true);

    const startFetch = () => {
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
    };

    // Avoid competing with initial render/LCP when permission is already granted.
    const w = window as any;
    const idleId = typeof w.requestIdleCallback === 'function'
      ? w.requestIdleCallback(startFetch, { timeout: 1500 })
      : null;
    const timeoutId = idleId === null ? window.setTimeout(startFetch, 0) : null;

    return () => {
      isMounted = false;
      if (idleId !== null && typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
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

  async function requestUserLocation() {
    if (!navigator.geolocation) {
      setGeoError(t('home.locationNotSupported') || "Geolocalização não suportada");
      return;
    }
    // sempre pedir localização atual (não restauramos de cache)

    setIsRequestingLocation(true);
    setGeoError(null);

    // If Permissions API is available, check for denied state to avoid silent failure
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - PermissionName typing in some envs
      if (navigator.permissions && (navigator.permissions as any).query) {
        try {
          const status = await (navigator.permissions as any).query({ name: 'geolocation' });
          if (status && status.state === 'denied') {
            setGeoError(t('home.locationDeniedInstructions'));
            setIsRequestingLocation(false);
            return;
          }
        } catch (_) {
          // ignore permission query errors and fallback to getCurrentPosition call
        }
      }
    } catch (_) {
      // ignore
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setIsRequestingLocation(false);
      },
      (err) => {
        // If permission denied, show friendly instruction
        // err.code === 1 is PERMISSION_DENIED
        if ((err as any)?.code === 1) {
          setGeoError(t('home.locationDeniedInstructions') || err.message);
        } else {
          setGeoError(err.message);
        }
        setIsRequestingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
  const MARCO_ZERO_LAT = -23.4780169;
  const MARCO_ZERO_LNG = -46.7378296;
  const distanceFromMarco = userLocation
    ? distanceInKm(userLocation.latitude, userLocation.longitude, MARCO_ZERO_LAT, MARCO_ZERO_LNG)
    : null;
  const isOutsideGreaterRegion = distanceFromMarco !== null ? distanceFromMarco > 40 : false;

  // Ordena e prioriza bairros exibidos na grade principal
  const topNeighborhoods = useMemo(() => {
    const prefer = [
      "Pinheiros",
      "Vila Madalena",
      "Bela Vista",
      "Centro Histórico",
      "Liberdade",
      "Paraíso",
      "Vila Olímpia",
    ];
    const norm = (s: string) => slugify(s || '').toLowerCase();
    const used = new Set<number>();

    const preferredMatches: Neighborhood[] = [];
    prefer.forEach((name) => {
      const match = neighborhoods.find((n) => norm(n.neighborhoodName) === norm(name));
      if (match && !used.has(match.id)) {
        used.add(match.id);
        preferredMatches.push(match);
      }
    });

    const remaining = neighborhoods.filter((n) => !used.has(n.id));
    return [...preferredMatches, ...remaining].slice(0, 7);
  }, [neighborhoods]);
  return (
    <div>
      {/* Seção: E aí, onde é hoje? */}
      <WhereIsTodayMenu onOptionSelect={handleWhereIsTodaySelect} />

      {/* Seção: Perto de mim */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[3px] bg-[#B3261E]" />
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-12 overflow-hidden">
        <img
          src={imgMuseuIpiranga1280}
          srcSet={`${imgMuseuIpiranga640} 640w, ${imgMuseuIpiranga1280} 1280w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-20"
        />
        <div className="absolute inset-0 w-full h-full bg-[#212121] z-10" style={{ opacity: 0.65 }} />
        <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-4">
          <div className="flex items-start justify-between">
            <div>
              <SectionHeading 
                title={t('home.nearMeTitle')} 
                subtitle={t('home.nearMeSubtitle', { km: selectedDistance })} 
                className="mt-1 mb-1 mr-4" 
                underline={false} 
                card={false} 
                tone="dark" />
            </div>
            {userLocation && !noNearbyResults && !isOutsideGreaterRegion && (
              <div className="ml-4">
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDistanceModalOpen(true)}
                  className="px-3 py-1 sm:px-4 sm:py-2 mt-2"
                >
                  {t('common.changeDistance')}
                </AppButton>
              </div>
            )}
          </div>
          {/* Placeholder quando não há localização */}
          {!userLocation && (
            <div className="mt-6 flex flex-col items-center text-center">
              <AppText variant="subtitle-dark" className="max-w-xs leading-relaxed mb-4 whitespace-pre-line">{t('home.allowLocation')}</AppText>
              <AppButton
                variant="action"
                size="md"
                onClick={() => requestUserLocation()}
                disabled={isRequestingLocation}
                className="w-72 max-w-full px-4 py-3 text-[0.75rem]"
              >
                {t('home.allowLocationButton')}
              </AppButton>
              {geoError && !geoError.includes("User denied Geolocation") && (
                <p className="mt-3 text-[0.65rem] text-red-400">{geoError}</p>
              )}
            </div>
          )}
          {/* Controles e resultados quando há localização */}
          {userLocation && (
            <div className="mt-2 flex flex-col gap-2 text-gray-300">
              <div className="mt-3 space-y-2">
                {loadingNearby && (
                  <AppText variant="subtitle-dark">{t('home.loadingCategories')}</AppText>
                )}
                {!loadingNearby && noNearbyResults && (
                  <div className="text-center flex flex-col items-center gap-5 py-6">
                    <AppText variant="subtitle-dark" className="whitespace-pre-line">
                      {isOutsideGreaterRegion ? t('home.outsideGreaterSP') : t('home.noNearbyResultsRadius')}
                    </AppText>
                    {!isOutsideGreaterRegion && (
                      <AppButton
                        variant="action"
                        onClick={() => setIsDistanceModalOpen(true)}
                        className="px-4"
                      >
                        {t('common.changeDistance')}
                      </AppButton>
                    )}
                  </div>
                )}
                {!loadingNearby &&
                  nearbyStats
                    .filter((s) => s.count > 0)
                    .map((s) => {
                      const displayLabel = s.count === 1 ? getPlaceTypeLabelSingular(s.category) : s.label;
                      return (
                        <div
                          key={s.category}
                          onClick={() => {
                            // same behavior as the "ver locais" button when tapping the row
                            if (s.count === 1) {
                              const only = s.withinRadius[0];
                              if (only) {
                                navigate(`/${s.category}/${slugify(only.name)}`);
                              } else {
                                navigate(`/${s.category}`);
                              }
                            } else {
                              const ids = s.withinRadius.map((p) => p.id);
                              navigate(`/${s.category}`, { state: { ids } });
                            }
                          }}
                          className="border-b border-white/10 py-4 flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <div className="flex flex-col me-6">
                            <AppText variant="subtitle-dark">
                              {s.count} {displayLabel}
                            </AppText>
                            {s.nearestKm !== null && (
                              <AppText variant="body-dark">
                                {t('home.nearestLabel')}: {formatDistanceKm(s.nearestKm)}
                                {s.nearestName ? ` - ${s.nearestName}` : ""}
                              </AppText>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <AppButton
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); setMapCategory(s.category); }}
                              className="min-w-[120px] px-3 py-1"
                            >
                              {t('home.viewOnMap')}
                            </AppButton>
                            <AppButton
                              variant="action"
                              size="sm"
                              onClick={(e) => { 
                                e.stopPropagation();
                                if (s.count === 1) {
                                  const only = s.withinRadius[0];
                                  if (only) {
                                    navigate(`/${s.category}/${slugify(only.name)}`);
                                  } else {
                                    navigate(`/${s.category}`);
                                  }
                                } else {
                                  const ids = s.withinRadius.map((p) => p.id);
                                  navigate(`/${s.category}`, { state: { ids } });
                                }
                              }}
                              className="min-w-[120px] mt-3 px-3 py-1"
                            >
                              {s.count === 1 ? t('home.viewPlace') : t('home.viewPlaces')}
                            </AppButton>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}
        </div>{/* /wrapper Perto de mim */}
      </section>

      {/* Seção: Por bairro (grid 2x4 retangular) */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[3px] bg-[#B3261E]" />
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-12 overflow-hidden">
        <img
          src={imgPaulista1280}
          srcSet={`${imgPaulista640} 640w, ${imgPaulista1280} 1280w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-20"
        />
        <div className="absolute inset-0 w-full h-full bg-[#212121] z-10" style={{ opacity: 0.65 }} />
        <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-4">
          <SectionHeading title={t('home.neighborhoodsTitle')} subtitle={t('home.neighborhoodsTagline')} className="mb-6" underline={false} card={false} tone="dark" />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {topNeighborhoods.map((n) => (
              <AppButton
                key={n.id}
                variant="square"
                onClick={() => handleNeighborhoodSelect(n)}
                size="md"
                className="w-full px-4 py-4 leading-tight transition-color justify-center"
              >
                {n.neighborhoodName}
              </AppButton>
            ))}
            <AppButton
              variant="actionborder"
              onClick={() => setIsNeighborhoodModalOpen(true)}
              size="md"
              className="w-full py-4"
            >
              {t('home.viewMore')}
            </AppButton>
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
        <Suspense fallback={null}>
          <NearbyMapModal
            onClose={() => setMapCategory(null)}
            userLocation={userLocation}
            places={nearbyStats.find((s) => s.category === mapCategory)?.withinRadius || []}
            title={getPlaceTypeLabel(mapCategory.toUpperCase().replace(/-/g, "_") as any)}
          />
        </Suspense>
      )}
    </div>
  );
}