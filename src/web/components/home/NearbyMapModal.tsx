import { useEffect, useRef } from "react";
import type { PlaceRecommendation } from "@/core/domain/models/PlaceRecommendation";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icPing from '@/assets/imgs/icons/ic_pin.png';
import { useTranslation } from 'react-i18next';

interface NearbyMapModalProps {
  onClose: () => void;
  userLocation: { latitude: number; longitude: number };
  places: PlaceRecommendation[];
  title?: string;
}

export function NearbyMapModal({ onClose, userLocation, places, title }: NearbyMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
      }).setView([userLocation.latitude, userLocation.longitude], 14);

      // OpenStreetMap padrão claro
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contrib." 
      }).addTo(mapRef.current);

      // restore original small red dot for user location
      const userIcon = L.divIcon({
        html: '<div style="background:#e11; width:16px; height:16px; border-radius:50%; border:2px solid #fff"></div>',
        className: "",
        iconSize: [16, 16]
      });
      L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup(t('nearbyMap.you'));
    }

    // Remove antigos marcadores de lugares antes de adicionar novos
    const existingLayers: L.Layer[] = [];
    mapRef.current?.eachLayer((layer) => {
      if ((layer as any)._icon && !(layer as any)._popup?.getContent?.()?.includes("Você")) {
        existingLayers.push(layer);
      }
    });
    existingLayers.forEach((l) => mapRef.current?.removeLayer(l));

    // Add new place markers all using the project pin icon `ic_pin`
    const placeIcon = L.icon({
      iconUrl: icPing,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -30],
    });

    places.forEach((p) => {
      const mainAddress = p.addresses?.find((a) => a.isMainUnity) || p.addresses?.[0];
      if (!mainAddress?.latitude || !mainAddress?.longitude) return;
      L.marker([mainAddress.latitude, mainAddress.longitude], { icon: placeIcon }).addTo(mapRef.current as L.Map).bindPopup(p.name);
    });

    if (places.length > 0) {
      const bounds = L.latLngBounds([
        [userLocation.latitude, userLocation.longitude],
        ...places
          .map((p) => p.addresses?.find((a) => a.isMainUnity) || p.addresses?.[0])
          .filter((a): a is NonNullable<typeof a> => !!a && !!a.latitude && !!a.longitude)
          .map((a) => [a.latitude as number, a.longitude as number])
      ] as any);
      mapRef.current?.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [userLocation, places]);

  // Cleanup markers when closing (optional advanced handling omitted)

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3">
      <div className="w-full max-w-lg rounded-md bg-bs-card border border-white/15 shadow relative">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
            {title || t('nearbyMap.title')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm leading-none rounded-full border border-white/25 px-2 py-1 sm:px-3 sm:py-2 hover:border-bs-red font-bold"
          >
            {t('common.close')}
          </button>
        </div>
        <div ref={mapContainerRef} className="h-[300px] sm:h-[420px] w-full" />
        <div className="px-3 py-2 text-xs sm:text-[0.6rem] text-gray-400 border-t border-white/10">
          {places.length === 0 && <p>{t('nearbyMap.noneInRadius')}</p>}
          {places.length > 0 && <p>{t('nearbyMap.pointsDisplayed', { count: places.length })}</p>}
        </div>
      </div>
    </div>
  );
}
