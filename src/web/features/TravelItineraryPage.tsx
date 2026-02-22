import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/web/hooks/useDocumentTitle';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { Toolbar } from '@/web/components/layout/Toolbar';
import EnvironmentGrid from '@/web/components/ui/EnvironmentGrid';
import { TravelItineraryListItem } from '@/web/components/travel-itinerary/TravelItineraryListItem';
import { useNavigate } from 'react-router-dom';
import icWalkingTour from '@/assets/imgs/icons/ic_walking_tour.png';
import icTourCity from '@/assets/imgs/icons/ic_tour_city.png';
import icNumber1 from '@/assets/imgs/icons/ic_number1.png';
import icNumber2 from '@/assets/imgs/icons/ic_number2.png';
import icNumber3 from '@/assets/imgs/icons/ic_number3.png';
import icNumber4 from '@/assets/imgs/icons/ic_number4.png';
import icNumber5 from '@/assets/imgs/icons/ic_number5.png';
import icNumber6 from '@/assets/imgs/icons/ic_number6.png';
import icNumber7 from '@/assets/imgs/icons/ic_number7.png';
import icNumber8 from '@/assets/imgs/icons/ic_number8.png';
import icNumber9 from '@/assets/imgs/icons/ic_number9.png';
import icNumber10 from '@/assets/imgs/icons/ic_number10.png';
import { WarningTip } from '@/web/components/ui/WarningTip';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRecommendationList } from '@/web/hooks/useRecommendationList';
import { useOpeningPatterns } from '@/web/hooks/useOpeningPatterns';
import { isOpenNow } from '@/core/domain/enums/openingHoursUtils';
import type { PlaceRecommendation } from '@/core/domain/models/PlaceRecommendation';
import type { GeoJsonObject } from 'geojson';
import { ReportProblemFooter } from '@/web/components/layout/ReportProblemFooter';

type OsrmRouteResponse = {
    routes?: Array<{ geometry?: GeoJsonObject }>;
};

type TourPlaceRef = {
    id: number;
    placeType: string;
};

type TourItem = {
    id: number;
    name: string;
    tourType: string,
    description: string;
    places: TourPlaceRef[];
};

function buildGoogleMapsDirectionsUrl(points: Array<{ lat: number; lng: number }>) {
    if (!points || points.length < 2) return null;
    const origin = `${points[0].lat},${points[0].lng}`;
    const destination = `${points[points.length - 1].lat},${points[points.length - 1].lng}`;
    const waypoints = points.length > 2 ? points.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|') : '';
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
    if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
    return url;
}

export function TravelItineraryPage() {
    const { t } = useTranslation();
    useDocumentTitle(t('travelItinerary.title'));
    const navigate = useNavigate();
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const routeLayerRef = useRef<L.Layer | null>(null);

    const themeKey = React.useMemo(() => {
        try {
            return localStorage.getItem('travelItineraryTheme') || 'pos';
        } catch {
            return 'pos';
        }
    }, []);
    const initialThemeKeyRef = useRef(themeKey);

    const [selectedRouteOption, setSelectedRouteOption] = useState<string | null>(null);
    const [tourMode, setTourMode] = useState<'walking' | 'city'>('walking');
    const [tourItems, setTourItems] = useState<TourItem[]>([]);
    const [tourItemsLoading, setTourItemsLoading] = useState<boolean>(true);
    const [selectedTourItemId, setSelectedTourItemId] = useState<number | null>(null);
    const [showRouteDetails, setShowRouteDetails] = useState(false);
    const [isClosingRouteDetails, setIsClosingRouteDetails] = useState(false);
    const closeRouteDetailsTimeoutRef = useRef<number | null>(null);
    const [showCityComingSoonModal, setShowCityComingSoonModal] = useState(false);
    const cityComingSoonMessage = t('travelItinerary.cityComingSoon', {
        defaultValue: 'Opa, essa funcionalidade está quase pronta, em breve vai estar disponível pra você usar, fica ligado :)'
    });

    const routeOptions = React.useMemo(
        () => [
            { value: 'free', label: t('travelItinerary.routeOptions.free') },
            { value: 'nightlife', label: t('travelItinerary.routeOptions.nightlife') },
            { value: 'bars', label: t('travelItinerary.routeOptions.bars') },
            { value: 'food', label: t('travelItinerary.routeOptions.food') },
            { value: 'history', label: t('travelItinerary.routeOptions.history') },
            { value: 'museums', label: t('travelItinerary.routeOptions.museums') }
        ],
        [t]
    );

    useEffect(() => {
        let isMounted = true;
        setTourItemsLoading(true);
        const fileName = tourMode === 'city' ? 'citytour' : 'walkingtour';
        const rawBase = import.meta.env.BASE_URL || '/';
        const normalizedBase = rawBase.startsWith('http')
            ? new URL(rawBase).pathname || '/'
            : rawBase;
        const basePath = ('/' + normalizedBase).replace(/\/+/g, '/').replace(/\/$/, '/');
        const url = `${basePath}data/places/${fileName}.json`;
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load ${fileName}.json`);
                return res.json() as Promise<TourItem[]>;
            })
            .then((data) => {
                if (!isMounted) return;
                setTourItems(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!isMounted) return;
                setTourItems([]);
            })
            .finally(() => {
                if (!isMounted) return;
                setTourItemsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [tourMode]);

    const { data: restaurants, loading: loadingRestaurants } = useRecommendationList('restaurants');
    const { data: bars, loading: loadingBars } = useRecommendationList('bars');
    const { data: coffees, loading: loadingCoffees } = useRecommendationList('coffees');
    const { data: nightlife, loading: loadingNightlife } = useRecommendationList('nightlife');
    const { data: nature, loading: loadingNature } = useRecommendationList('nature');
    const { data: pleasures, loading: loadingPleasures } = useRecommendationList('pleasure');
    const { data: touristSpots, loading: loadingTouristSpots } = useRecommendationList('tourist-spot');
    const { data: forfun, loading: loadingForfun } = useRecommendationList('forfun');
    const { data: stores, loading: loadingStores } = useRecommendationList('stores');
    const loading = loadingRestaurants || loadingBars || loadingCoffees || loadingNightlife || loadingNature || loadingPleasures || loadingTouristSpots || loadingForfun || loadingStores;
    const { data: openingPatternsData } = useOpeningPatterns();
    const openingPatterns = openingPatternsData || [];

    useEffect(() => {
        if (tourItemsLoading) return;
        if (!tourItems || tourItems.length === 0) {
            setSelectedTourItemId(null);
            return;
        }
        const exists = tourItems.some((item) => item.id === selectedTourItemId);
        if (!exists) setSelectedTourItemId(tourItems[0].id);
    }, [tourItems, tourItemsLoading, selectedTourItemId]);

    // Helpers to compute opening periods and display text for a place
    function getPeriodsForDay(place: PlaceRecommendation, dayOffset = 0): any[] {
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

    function getOpeningDisplayForPlace(place: PlaceRecommendation): string {
        try {
            // If there is no patternId and no custom overrides, show unavailable
            if (!place.openingHours?.patternId && (!place.openingHours?.customOverrides || place.openingHours.customOverrides.length === 0)) {
                return t('placeList.hoursUnavailable', { defaultValue: 'Horário indisponível' });
            }

            const periodsToday = getPeriodsForDay(place, 0);
            if (!periodsToday || periodsToday.length === 0) {
                // scan next 7 days for first opening
                for (let offset = 1; offset <= 7; offset++) {
                    const future = getPeriodsForDay(place, offset);
                    if (!future || future.length === 0) continue;
                    // pick earliest open time
                    let earliest: string | null = null;
                    function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
                    for (const p of future) { if (!p.open) continue; if (earliest === null || parseTime(p.open) < parseTime(earliest)) earliest = p.open; }
                    if (earliest) {
                        if (offset === 1) return t('placeList.opensTomorrowAt', { time: earliest, defaultValue: `Abre amanhã às ${earliest}` });
                        // fallback to simple day label
                        const weekdaysPt = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
                        const now = new Date();
                        const weekday = weekdaysPt[(now.getDay() + offset) % 7];
                        return t('placeList.opensOnAt', { day: weekday, time: earliest, defaultValue: `Abre ${weekday} às ${earliest}` });
                    }
                }
                return '-';
            }

            if (isOpenNow(periodsToday)) return t('placeList.openNow', { defaultValue: 'Aberto agora' });

            // compute next opening time today
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
            let nextOpenMinutes: number | null = null;
            let nextOpenStr: string | null = null;
            for (const p of periodsToday) {
                if (!p.open) continue;
                const om = parseTime(p.open);
                if (om > currentMinutes && (nextOpenMinutes === null || om < nextOpenMinutes)) {
                    nextOpenMinutes = om; nextOpenStr = p.open;
                }
            }
            if (nextOpenMinutes !== null && nextOpenStr) {
                const diff = nextOpenMinutes - currentMinutes;
                if (diff <= 60) return t('placeList.opensSoon', { defaultValue: 'Abre em instantes' });
                return t('placeList.opensAt', { time: nextOpenStr, defaultValue: `Abre às ${nextOpenStr}` });
            }

            // fallback: try next days (reuse logic above to find first upcoming)
            for (let offset = 1; offset <= 7; offset++) {
                const future = getPeriodsForDay(place, offset);
                if (!future || future.length === 0) continue;
                let earliest: string | null = null;
                function parseTime2(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
                for (const p of future) { if (!p.open) continue; if (earliest === null || parseTime2(p.open) < parseTime2(earliest)) earliest = p.open; }
                if (earliest) {
                    if (offset === 1) return t('placeList.opensTomorrowAt', { time: earliest, defaultValue: `Abre amanhã às ${earliest}` });
                    const weekdaysPt = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
                    const now2 = new Date();
                    const weekday = weekdaysPt[(now2.getDay() + offset) % 7];
                    return t('placeList.opensOnAt', { day: weekday, time: earliest, defaultValue: `Abre ${weekday} às ${earliest}` });
                }
            }
            return '-';
        } catch (e) {
            return '-';
        }
    }

    function normalizePlaceType(type: string) {
        return (type || '').replace(/-/g, '_').toUpperCase();
    }

    const placesByType = React.useMemo(() => ({
        RESTAURANTS: restaurants,
        BARS: bars,
        COFFEES: coffees,
        NIGHTLIFE: nightlife,
        NATURE: nature,
        PLEASURE: pleasures,
        TOURIST_SPOT: touristSpots,
        FORFUN: forfun,
        STORES: stores,
    }), [restaurants, bars, coffees, nightlife, nature, pleasures, touristSpots, forfun, stores]);

    const displayedTourItems = React.useMemo(() => {
        if (!selectedRouteOption) return tourItems;
        const ROUTE_TO_TOUR_KEY: Record<string, string> = {
            free: 'FREE',
            nightlife: 'NIGHTLIFE',
            bars: 'BARS',
            food: 'GASTRONOMIC',
            history: 'HISTORY',
            museums: 'MUSEUMS'
        };
        const targetKey = ROUTE_TO_TOUR_KEY[selectedRouteOption] || selectedRouteOption;
        const normalize = (v: any) => (String(v || '')).replace(/-/g, '_').toUpperCase();
        return (tourItems || []).filter((item) => normalize(item.tourType) === normalize(targetKey));
    }, [tourItems, selectedRouteOption]);

    // Build ordered points from selected tour item places (include opening text)
    const orderedPoints = React.useMemo(() => {
        if (!selectedTourItemId) return [] as Array<{ name: string; lat: number; lng: number; openingText?: string }>;
        const tourItem = tourItems.find((item) => item.id === selectedTourItemId);
        if (!tourItem || !tourItem.places || tourItem.places.length === 0) {
            return [] as Array<{ name: string; lat: number; lng: number; openingText?: string }>;
        }
        const pts: Array<{ name: string; lat: number; lng: number; openingText?: string }> = [];
        for (const ref of tourItem.places) {
            const typeKey = normalizePlaceType(ref.placeType);
            const list = placesByType[typeKey as keyof typeof placesByType] || [];
            const place = list.find((p) => Number(p.id) === Number(ref.id));
            if (!place) continue;
            const addr = place.addresses?.[0];
            const lat = addr?.latitude;
            const lng = addr?.longitude;
            if (typeof lat !== 'number' || typeof lng !== 'number') continue;
            const openingText = getOpeningDisplayForPlace(place);
            pts.push({ name: place.name, lat, lng, openingText });
        }
        return pts;
    }, [tourItems, selectedTourItemId, placesByType, openingPatterns, t]);

    useEffect(() => {
        if (!showRouteDetails) return;
        if (!mapRef.current) return;
        if (orderedPoints.length === 0) return;

        // Initialize map
        const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false });
        mapInstanceRef.current = map;

        // initial tile layer based on themeKey
        const themes: Record<string, { name: string; url: string; attribution?: string }> = {
            osm: { name: 'OpenStreetMap', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap contributors' },
            pos: { name: 'CartoDB Positron', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CartoDB' },
            dark: { name: 'CartoDB Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CartoDB' },
            toner: { name: 'Stamen Toner', url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', attribution: '&copy; Stamen' },
            satellite: { name: 'Esri WorldImagery', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' }
        };

        const theme = themes[initialThemeKeyRef.current] || themes.osm;
        tileLayerRef.current = L.tileLayer(theme.url, { attribution: theme.attribution || '' }).addTo(map);

        const latlngs = orderedPoints.map(p => L.latLng(p.lat, p.lng));

        // add numbered icon markers and popups with order numbers
        const icons: L.Icon[] = [
            L.icon({ iconUrl: icNumber1, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber2, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber3, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber4, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber5, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber6, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber7, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber8, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber9, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] }),
            L.icon({ iconUrl: icNumber10, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] })
        ];

        orderedPoints.forEach((p, idx) => {
            const icon = icons[idx] || icons[0];
            const marker = L.marker([p.lat, p.lng], { icon });
            marker.addTo(map).bindPopup(`<strong>${idx + 1}. ${p.name}</strong>`);
        });

        const bounds = L.latLngBounds(latlngs);
        map.fitBounds(bounds.pad(0.2));

        // attempt to fetch walking route from OSRM public server and draw it
        (async () => {
            try {
                if (orderedPoints.length < 2) return;
                const coords = orderedPoints.map(p => `${p.lng},${p.lat}`).join(';');
                const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`OSRM error ${res.status}`);
                const json: OsrmRouteResponse = await res.json();
                const route = json.routes?.[0]?.geometry ?? null;
                if (route) {
                    // remove existing route layer
                    try { if (routeLayerRef.current) map.removeLayer(routeLayerRef.current); } catch { /* ignore */ }
                    const layer = L.geoJSON(route, { style: { color: '#d94b4b', weight: 4, opacity: 0.9 } });
                    layer.addTo(map);
                    routeLayerRef.current = layer;
                }
            } catch (e) {
                // OSRM may not support foot profile on public server; fail silently but log for debugging
                console.warn('Could not fetch walking route from OSRM:', e);
            }
        })();

        return () => {
            try {
                if (routeLayerRef.current) {
                    try { map.removeLayer(routeLayerRef.current); } catch { /* ignore */ }
                    routeLayerRef.current = null;
                }
                map.remove();
            } finally {
                mapInstanceRef.current = null;
                tileLayerRef.current = null;
            }
        };
    }, [orderedPoints, showRouteDetails]);

    useEffect(() => {
        return () => {
            if (closeRouteDetailsTimeoutRef.current) {
                window.clearTimeout(closeRouteDetailsTimeoutRef.current);
            }
        };
    }, []);

    const openRouteDetails = (itemId?: number) => {
        if (typeof itemId === 'number') {
            setSelectedTourItemId(itemId);
        }
        if (closeRouteDetailsTimeoutRef.current) {
            window.clearTimeout(closeRouteDetailsTimeoutRef.current);
            closeRouteDetailsTimeoutRef.current = null;
        }
        setIsClosingRouteDetails(false);
        setShowRouteDetails(true);
    };

    const closeRouteDetails = () => {
        if (isClosingRouteDetails) return;
        setIsClosingRouteDetails(true);
        closeRouteDetailsTimeoutRef.current = window.setTimeout(() => {
            setShowRouteDetails(false);
            setIsClosingRouteDetails(false);
            closeRouteDetailsTimeoutRef.current = null;
        }, 300);
    };

    const onVerRota = () => {
        const pts = orderedPoints.map(p => ({ lat: p.lat, lng: p.lng }));
        const url = buildGoogleMapsDirectionsUrl(pts);
        if (url) window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            <Toolbar onBack={() => navigate(-1)} />

            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
                <div className="mx-auto max-w-5xl px-0 sm:px-4 pt-0 pb-6 sm:pb-12 text-black">
                    <div className="w-full rounded-b-[30px] px-4 lg:px-8 py-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <img src={icWalkingTour} alt={t('travelItinerary.title')} className="w-12 h-12 object-contain" />
                                <div>
                                    <SectionHeading title={t('travelItinerary.title')} underline={false} sizeClass="text-lg sm:text-2xl text-[#212121]" />
                                    <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{t('travelItinerary.placeholder')}</p>
                                </div>
                            </div>

                            <div>
                                <div className="pt-4">
                                    <div className="relative flex flex-row w-full border-b border-[#212121] overflow-x-auto no-scrollbar">
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setTourMode('walking')}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') setTourMode('walking');
                                            }}
                                            className={`flex-1 min-w-[160px] cursor-pointer select-none px-2 pt-4 pb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] transition-colors text-center ${
                                                tourMode === 'walking'
                                                    ? 'text-[#B3261E] bg-[#F5F5F5] border-l border-t border-r border-[#212121] rounded-tl-[8px] rounded-tr-[8px]'
                                                    : 'text-[#6B6B6B] bg-transparent'
                                            }`}
                                        >
                                            <span className="category-card-label inline-flex items-center justify-center gap-2 w-full">
                                                <img src={icWalkingTour} alt="" className="w-4 h-4 object-contain" />
                                                {t('travelItinerary.modes.walking')}
                                            </span>
                                        </div>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setShowCityComingSoonModal(true)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') setShowCityComingSoonModal(true);
                                            }}
                                            className={`flex-1 min-w-[160px] cursor-pointer select-none px-2 pt-4 pb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] transition-colors text-center ${
                                                tourMode === 'city'
                                                    ? 'text-[#B3261E] bg-[#F5F5F5] border-l border-t border-r border-[#212121] rounded-tl-[8px] rounded-tr-[8px]'
                                                    : 'text-[#6B6B6B] bg-transparent'
                                            }`}
                                        >
                                            <span className="category-card-label inline-flex items-center justify-center gap-2 w-full">
                                                <img src={icTourCity} alt="" className="w-4 h-4 object-contain" />
                                                {t('travelItinerary.modes.city')} (beta)
                                            </span>
                                        </div>
                                        <div className="absolute left-0 right-0 bottom-0 w-full pointer-events-none">
                                            <div
                                                className={`h-[2px] w-1/2 bg-[#B3261E] transition-transform duration-300 ease-out mt-4 ${
                                                    tourMode === 'city' ? 'translate-x-full' : 'translate-x-0'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#F5F5F5] pb-20 px-4 lg:px-4">
                                    <EnvironmentGrid
                                        title={t('travelItinerary.routeOptionsTitle')}
                                        environments={routeOptions}
                                        selectedEnv={selectedRouteOption}
                                        onSelect={setSelectedRouteOption}
                                        onViewMore={() => null}
                                        showViewMore={false}
                                        containerClassName="bg-transparent text-black pb-4"
                                        contentPaddingClassName="px-0"
                                    />

                                    <h3 className="font-bold text-lg mb-3 pt-8 mt-3 px-0">
                                        Roteiros criados pra você :)
                                    </h3>
                                    {tourItemsLoading && (
                                        <p className="text-sm text-gray-500 px-0">
                                            {t('common.loading')}
                                        </p>
                                    )}
                                    {!tourItemsLoading && displayedTourItems.length === 0 && (
                                        <p className="text-sm text-gray-500 px-0">
                                            {t('common.noPlaces')}
                                        </p>
                                    )}
                                    {!tourItemsLoading && displayedTourItems.length > 0 && (
                                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
                                            {displayedTourItems.map((item, idx) => (
                                                <TravelItineraryListItem
                                                    key={`${tourMode}-${item.id}-${idx}`}
                                                    name={item.name}
                                                    placesCountText={t('travelItinerary.placesCount', { count: item.places?.length || 0 })}
                                                    iconSrc={tourMode === 'city' ? icTourCity : icWalkingTour}
                                                    onDetails={() => openRouteDetails(item.id)}
                                                    detailsLabel={t('travelItinerary.viewRoute')}
                                                    tourType={item.tourType}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {loading && <p className="text-sm text-gray-500">Carregando pontos...</p>}
                                    {!loading && orderedPoints.length === 0 && (
                                        <p className="text-sm text-gray-500">Ainda não foi possível carregar os pontos do tour.</p>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showRouteDetails && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="route-details-title"
                    onClick={closeRouteDetails}
                >
                    <div className="w-full max-w-4xl px-0 sm:px-12" onClick={(event) => event.stopPropagation()}>
                        <div
                            className={`w-full rounded-t-2xl bg-white text-black px-4 lg:px-8 pt-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto ${
                                isClosingRouteDetails ? 'bottomsheet-animate-out' : 'bottomsheet-animate'
                            }`}
                        >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 id="route-details-title" className="text-lg font-bold">
                                    Detalhes do Roteiro
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Aqui estão as informações necessárias com as rotas para você realizar
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeRouteDetails}
                                className="btn-close-round btn-close-round-dark text-xl font-bold focus:outline-none focus:ring-2 focus:ring-bs-red/70"
                                aria-label={t('common.close')}
                            >
                                ×
                            </button>
                        </div>

                        <div
                            ref={mapRef}
                            style={{ height: 320, border: '1px solid #212121', borderRadius: 8, overflow: 'hidden' }}
                            className="w-full mt-4"
                        />

                        <h4 className="mt-4 text-sm font-bold uppercase tracking-[0.06em] text-gray-700">
                            Lugares por onde você vai passar
                        </h4>
                        {orderedPoints.length > 0 ? (
                            <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                                {orderedPoints.map((point) => (
                                    <li key={point.name}>
                                        {point.name}{point.openingText ? ` (${point.openingText})` : ''}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 text-sm text-gray-500">Ainda não foi possível carregar os lugares do roteiro.</p>
                        )}

                        <WarningTip
                            title={t('travelItinerary.tipTitle')}
                            description={t('travelItinerary.tipDescription')}
                            className="mt-4 mb-8"
                        />

                        <div className="mt-4">
                            <button
                                onClick={onVerRota}
                                className="btn-hover-red w-full bg-[#F5F5F5] text-black font-semibold uppercase tracking-[0.04em] rounded px-4 py-3"
                            >
                                Abrir no Google Maps
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            )}

            {showCityComingSoonModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-bs-card rounded-lg shadow-lg w-[90vw] max-w-md border border-white">
                        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-bs-red">
                            <SectionHeading title={t('travelItinerary.modes.city')} underline={false} sizeClass="text-lg" className="flex-1" />
                            <button
                                onClick={() => setShowCityComingSoonModal(false)}
                                className="btn-close-round text-xl font-bold"
                                aria-label={t('common.close')}
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-5 text-center">
                            <p className="mb-2 text-sm text-gray-200">
                                {cityComingSoonMessage}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1">
                {/* Main intentionally empty for itineraries */}
            </main>

            <ReportProblemFooter subject="Reportar um problema da página de roteiros" />
        </div>
    );
}
