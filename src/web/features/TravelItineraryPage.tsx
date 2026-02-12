import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRecommendationList } from '@/web/hooks/useRecommendationList';
import type { PlaceRecommendation } from '@/core/domain/models/PlaceRecommendation';
import type { GeoJsonObject } from 'geojson';

const TOUR_IDS = [31, 15, 26, 20];

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
        fetch(`/data/places/${fileName}.json`)
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

    const { data: touristSpots, loading } = useRecommendationList('tourist-spot');

    // Build ordered points from TOUR_IDS
    const orderedPoints = React.useMemo(() => {
        if (!touristSpots || touristSpots.length === 0) return [] as Array<{ name: string; lat: number; lng: number }>;
        const byId = new Map<number, PlaceRecommendation>();
        touristSpots.forEach((p) => byId.set(Number(p.id), p));
        const pts: Array<{ name: string; lat: number; lng: number }> = [];
        for (const id of TOUR_IDS) {
            const place = byId.get(id);
            if (!place) continue;
            const addr = place.addresses?.[0];
            const lat = addr?.latitude;
            const lng = addr?.longitude;
            if (typeof lat !== 'number' || typeof lng !== 'number') continue;
            pts.push({ name: place.name, lat, lng });
        }
        return pts;
    }, [touristSpots]);

    useEffect(() => {
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
            L.icon({ iconUrl: icNumber5, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] })
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
    }, [orderedPoints]);

    const onVerRota = () => {
        const pts = orderedPoints.map(p => ({ lat: p.lat, lng: p.lng }));
        const url = buildGoogleMapsDirectionsUrl(pts);
        if (url) window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            <Toolbar onBack={() => navigate(-1)} />

            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
                <div className="mx-auto max-w-5xl px-0 sm:px-12 pt-0 pb-6 sm:pb-12 text-black">
                    <div className="w-full rounded-b-[30px] px-4 lg:px-8 py-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <img src={icWalkingTour} alt={t('travelItinerary.title')} className="w-12 h-12 object-contain" />
                                <div>
                                    <SectionHeading title={t('travelItinerary.title')} underline={false} sizeClass="text-2xl sm:text-3xl text-black" />
                                    <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{t('travelItinerary.placeholder')}</p>
                                </div>
                            </div>

                            <div>
                                <div className="pt-4">
                                    <div className="relative grid grid-cols-2 gap-0">
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setTourMode('walking')}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') setTourMode('walking');
                                            }}
                                            className={`w-full cursor-pointer select-none px-0 pt-4 pb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] transition-colors ${
                                                tourMode === 'walking'
                                                    ? 'text-[#B3261E] bg-[#F5F5F5] border-l border-t border-r border-[#48464C] rounded-tl-[8px] rounded-tr-[8px]'
                                                    : 'text-[#6B6B6B] bg-transparent'
                                            }`}
                                        >
                                            <span className="inline-flex items-center justify-center gap-2 w-full">
                                                <img src={icWalkingTour} alt="" className="w-4 h-4 object-contain" />
                                                {t('travelItinerary.modes.walking')}
                                            </span>
                                        </div>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setTourMode('city')}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') setTourMode('city');
                                            }}
                                            className={`w-full cursor-pointer select-none px-0 pt-4 pb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] transition-colors ${
                                                tourMode === 'city'
                                                    ? 'text-[#B3261E] bg-[#F5F5F5] border-l border-t border-r border-[#48464C] rounded-tl-[8px] rounded-tr-[8px]'
                                                    : 'text-[#6B6B6B] bg-transparent'
                                            }`}
                                        >
                                            <span className="inline-flex items-center justify-center gap-2 w-full">
                                                <img src={icTourCity} alt="" className="w-4 h-4 object-contain" />
                                                {t('travelItinerary.modes.city')}
                                            </span>
                                        </div>
                                        <div className="absolute left-0 right-0 bottom-0 w-full">
                                            <div
                                                className={`h-[2px] w-1/2 bg-[#B3261E] transition-transform duration-300 ease-out mt-4 ${
                                                    tourMode === 'city' ? 'translate-x-full' : 'translate-x-0'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#F5F5F5] px-4 lg:px-8">
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
                                        {t('travelItinerary.listTitle')}
                                    </h3>
                                    {tourItemsLoading && (
                                        <p className="text-sm text-gray-500 px-0">
                                            {t('common.loading')}
                                        </p>
                                    )}
                                    {!tourItemsLoading && tourItems.length === 0 && (
                                        <p className="text-sm text-gray-500 px-0">
                                            {t('common.noPlaces')}
                                        </p>
                                    )}
                                    {!tourItemsLoading && tourItems.length > 0 && (
                                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
                                            {tourItems.map((item, idx) => (
                                                <TravelItineraryListItem
                                                    key={`${tourMode}-${item.id}-${idx}`}
                                                    name={item.name}
                                                    placesCountText={t('travelItinerary.placesCount', { count: item.places?.length || 0 })}
                                                    iconSrc={tourMode === 'city' ? icTourCity : icWalkingTour}
                                                    onDetails={() => null}
                                                    detailsLabel="Ver roteiro"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {loading && <p className="text-sm text-gray-500">Carregando pontos...</p>}
                                    {!loading && orderedPoints.length === 0 && (
                                        <p className="text-sm text-gray-500">Ainda não foi possível carregar os pontos do tour.</p>
                                    )}

                                    <div
                                        ref={mapRef}
                                        style={{ height: 320, border: '1px solid #48464C', borderRadius: 8, overflow: 'hidden' }}
                                        className="w-full mt-4"
                                    />

                                    <div className="mt-4 flex gap-2">
                                        <button onClick={onVerRota} className="btn-hover-red w-full max-w-xs bg-[#F5F5F5] text-black font-semibold uppercase tracking-[0.04em] rounded px-4 py-3">
                                            Ver Rota
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="flex-1">
                {/* Main intentionally empty for itineraries */}
            </main>
        </div>
    );
}
