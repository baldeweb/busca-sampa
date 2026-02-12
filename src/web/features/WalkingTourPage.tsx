import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { Toolbar } from '@/web/components/layout/Toolbar';
import { useNavigate } from 'react-router-dom';
import icWalkingTour from '@/assets/imgs/icons/ic_walking_tour.png';
import icNumber1 from '@/assets/imgs/icons/ic_number1.png';
import icNumber2 from '@/assets/imgs/icons/ic_number2.png';
import icNumber3 from '@/assets/imgs/icons/ic_number3.png';
import icNumber4 from '@/assets/imgs/icons/ic_number4.png';
import icNumber5 from '@/assets/imgs/icons/ic_number5.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRecommendationList } from '@/web/hooks/useRecommendationList';

const TOUR_IDS = [31, 15, 26, 20];

function buildGoogleMapsDirectionsUrl(points: Array<{ lat: number; lng: number }>) {
    if (!points || points.length < 2) return null;
    const origin = `${points[0].lat},${points[0].lng}`;
    const destination = `${points[points.length - 1].lat},${points[points.length - 1].lng}`;
    const waypoints = points.length > 2 ? points.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|') : '';
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
    if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
    return url;
}

export function WalkingTourPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const routeLayerRef = useRef<L.Layer | null>(null);

    const [themeKey, setThemeKey] = useState<string>(() => {
        try {
            return localStorage.getItem('walkingTourTheme') || 'pos';
        } catch (e) {
            return 'pos';
        }
    });
    // picker removed — default to confirmed so no selector UI appears
    const [themeConfirmed, setThemeConfirmed] = useState<boolean>(() => true);

    const { data: touristSpots, loading } = useRecommendationList('tourist-spot');

    // Build ordered points from TOUR_IDS
    const orderedPoints = React.useMemo(() => {
        if (!touristSpots || touristSpots.length === 0) return [] as Array<{ name: string; lat: number; lng: number }>;
        const byId = new Map<number, any>();
        touristSpots.forEach((p: any) => byId.set(Number(p.id), p));
        const pts: Array<{ name: string; lat: number; lng: number }> = [];
        for (const id of TOUR_IDS) {
            const place = byId.get(id);
            if (!place) continue;
            const addr = (place.addresses || [])[0];
            if (!addr || typeof addr.latitude !== 'number' || typeof addr.longitude !== 'number') continue;
            pts.push({ name: place.name, lat: addr.latitude, lng: addr.longitude });
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

        const theme = themes[themeKey] || themes.osm;
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
                const json = await res.json();
                const route = (json && json.routes && json.routes[0] && json.routes[0].geometry) ? json.routes[0].geometry : null;
                if (route) {
                    // remove existing route layer
                    try { if (routeLayerRef.current) map.removeLayer(routeLayerRef.current); } catch (e) { /* ignore */ }
                    const layer = L.geoJSON(route as any, { style: { color: '#d94b4b', weight: 4, opacity: 0.9 } });
                    layer.addTo(map);
                    routeLayerRef.current = layer;
                }
            } catch (e) {
                // OSRM may not support foot profile on public server; fail silently but log for debugging
                // eslint-disable-next-line no-console
                console.warn('Could not fetch walking route from OSRM:', e);
            }
        })();

        return () => {
            try {
                if (routeLayerRef.current) {
                    try { map.removeLayer(routeLayerRef.current); } catch (e) { /* ignore */ }
                    routeLayerRef.current = null;
                }
                map.remove();
            } finally {
                mapInstanceRef.current = null;
                tileLayerRef.current = null;
            }
        };
    }, [orderedPoints]);

    // update tile layer when themeKey changes (live preview)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        const themes: Record<string, { name: string; url: string; attribution?: string }> = {
            osm: { name: 'OpenStreetMap', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap contributors' },
            pos: { name: 'CartoDB Positron', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CartoDB' },
            dark: { name: 'CartoDB Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CartoDB' },
            toner: { name: 'Stamen Toner', url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', attribution: '&copy; Stamen' },
            satellite: { name: 'Esri WorldImagery', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' }
        };
        const theme = themes[themeKey] || themes.osm;
        // replace tile layer
        try {
            if (tileLayerRef.current) {
                map.removeLayer(tileLayerRef.current);
            }
        } catch (e) {
            /* ignore */
        }
        tileLayerRef.current = L.tileLayer(theme.url, { attribution: theme.attribution || '' }).addTo(map);
    }, [themeKey]);

    const onVerRota = () => {
        const pts = orderedPoints.map(p => ({ lat: p.lat, lng: p.lng }));
        const url = buildGoogleMapsDirectionsUrl(pts as any);
        if (url) window.open(url, '_blank');
    };

    // persist chosen default theme to localStorage (ensure pos is stored)
    useEffect(() => {
        try {
            localStorage.setItem('walkingTourTheme', themeKey);
        } catch (e) {
            // ignore
        }
    }, [themeKey]);

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            <Toolbar onBack={() => navigate(-1)} />

            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
                <div className="mx-auto max-w-5xl px-0 sm:px-12 pt-0 pb-6 sm:pb-12 text-black">
                    <div className="w-full rounded-b-[30px] px-4 py-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <img src={icWalkingTour} alt="walking tour" className="w-12 h-12 object-contain" />
                                <div>
                                    <SectionHeading title={t('walkingTour.title')} underline={false} sizeClass="text-2xl sm:text-3xl text-black" />
                                    <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{t('walkingTour.placeholder')}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                {loading && <p className="text-sm text-gray-500">Carregando pontos...</p>}
                                {!loading && orderedPoints.length === 0 && (
                                    <p className="text-sm text-gray-500">Ainda não foi possível carregar os pontos do tour.</p>
                                )}

                                {!themeConfirmed && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2">Escolha um tema para visualizar no mapa:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {THEMES_UI.map(t => (
                                                <button key={t.key} onClick={() => setThemeKey(t.key)} className={`px-3 py-1 rounded border ${themeKey === t.key ? 'border-black bg-gray-200 text-black' : 'border-gray-300 bg-white text-black'}`}>
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-3">
                                            <button onClick={onConfirmTheme} disabled={!themeKey} className="px-4 py-2 bg-blue-600 text-white rounded">
                                                Confirmar tema
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div
                                    ref={mapRef as any}
                                    style={{ height: 320, border: '1px solid #48464C', borderRadius: 8, overflow: 'hidden' }}
                                    className="w-full"
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
            </section>

            <main className="flex-1">
                {/* Main intentionally empty for walking tour */}
            </main>
        </div>
    );
}
