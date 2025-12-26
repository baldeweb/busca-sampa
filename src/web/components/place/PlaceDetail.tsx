import React from "react";
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { getPriceRangeLabel } from "@/core/domain/enums/priceRangeLabel";
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { FaInstagram, FaMapMarkerAlt, FaExclamationTriangle, FaPhone, FaWhatsapp, FaStar, FaCheck } from "react-icons/fa";
import { BackHeader } from '@/web/components/layout/BackHeader';
import icUber from '@/assets/imgs/icons/ic_uber.png';
import { useTranslation } from 'react-i18next';

interface PlaceDetailProps {
    isAlreadyVisited?: boolean;
    onShowOpeningHours?: () => void;
    priceRange?: string;
    name: string;
    description: string;
    type: string;
    icon?: React.ReactNode;
    openingDays: string[];
    isOpenNow: boolean;
    neighborhood?: string;
    address?: string;
    googleMapsUrl?: string;
    addresses?: Array<any>;
    phones?: Array<{ number?: string; isWhatsApp?: boolean }>;
    instagramUrl: string;
    menuUrl: string;
    websiteUrl?: string;
    openingPatternId?: string;
    notes: string[];
    onBack: () => void;
    tags?: string[];
}

export const PlaceDetail: React.FC<PlaceDetailProps> = ({
    name,
    description,
    type,
    priceRange,
    icon,
    openingDays,
    isOpenNow,
    neighborhood,
    address,
    googleMapsUrl,
    addresses = [],
    phones = [],
    instagramUrl,
    menuUrl,
    websiteUrl = "",
    openingPatternId = "",
    notes,
    onBack,
    onShowOpeningHours,
    isAlreadyVisited,
    tags = [],
}) => {
    const { t, i18n } = useTranslation();

    const toNumberOrNull = (value: unknown): number | null => {
        if (typeof value === 'number') return Number.isFinite(value) ? value : null;
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed) return null;
            const normalized = trimmed.replace(',', '.');
            const parsed = Number.parseFloat(normalized);
            return Number.isFinite(parsed) ? parsed : null;
        }
        return null;
    };

    const hasValidCoords = (lat: number | null, lng: number | null) => {
        if (lat == null || lng == null) return false;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
        if (Math.abs(lat) > 90) return false;
        if (Math.abs(lng) > 180) return false;
        return true;
    };
    const OPEN_UBER_MAP: Record<string, string> = {
        pt: 'Abrir no Uber',
        es: 'Abrir en Uber',
        fr: 'Ouvrir dans Uber',
        ru: 'Открыть в Uber',
        zh: '在 Uber 中打开',
        en: 'Open in Uber',
        de: 'In Uber öffnen',
        ja: 'Uberで開く',
        ar: 'افتح في Uber',
        it: 'Apri in Uber',
        nl: 'Open in Uber',
        tr: "Uber'da aç",
        pl: 'Otwórz w Uberze'
    };
    const domLang = (typeof document !== 'undefined' && document.documentElement.lang) ? document.documentElement.lang : '';
    const uiLang = (domLang || i18n.language || 'en').split('-')[0];
    const key = 'placeDetail.openUber';
    const openUberLabel = i18n.exists(key, { lng: uiLang })
        ? i18n.t(key, { lng: uiLang })
        : (OPEN_UBER_MAP[uiLang] || OPEN_UBER_MAP.en);
    const [showVisitModal, setShowVisitModal] = React.useState(false);

    // Ambiente: use `tags` consistently
    const ambienteList: string[] = tags || [];

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            {/* Top Bar - BackHeader (consistent with Neighborhood list) */}
            <BackHeader onBack={onBack} showVisitedButton={true} isAlreadyVisited={Boolean(isAlreadyVisited)} onVisitedClick={() => setShowVisitModal(true)} />
            {/* Modal explicativo */}
            {showVisitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-bs-card rounded-lg shadow-lg w-[90vw] max-w-md border border-white">
                        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-bs-red">
                            <SectionHeading title={t('placeDetail.visitModalTitle')} underline={false} sizeClass="text-lg" className="flex-1" />
                            <button onClick={() => setShowVisitModal(false)} className="text-white text-xl font-bold">×</button>
                        </div>
                        <div className="p-5 text-center">
                            <p className="mb-2 text-sm text-gray-200">
                                {isAlreadyVisited ? (
                                    // text for places already visited
                                    t('placeDetail.visitedModalParagraph')
                                ) : (
                                    // text for places pending visit (existing behavior)
                                    <>
                                        {t('placeDetail.visitModalParagraph')}<br /><br />
                                        <span className="font-bold text-red-400">{t('placeDetail.neverEmphasis')}</span> {t('placeDetail.visitModalEnding')}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content (match NeighborhoodList full-bleed + inner padding) */}
            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5] text-black">
                <div className="mx-auto max-w-5xl px-4 sm:px-12 py-2">
                        <div className="border-b-2 border-bs-red px-0 pt-6 sm:pt-10 pb-6 sm:pb-10 flex items-center">
                            {icon || <span className="text-4xl sm:text-5xl mr-4">☕</span>}
                            <div>
                                <SectionHeading title={name} underline={false} sizeClass="text-xl sm:text-2xl text-black" />
                                <p className="text-xs sm:text-sm text-gray-700">{description}</p>
                                {priceRange && (
                                    <p className="text-xs mt-1 text-gray-700">
                                        <span className="font-semibold">{t('placeDetail.priceLabel')}</span> {getPriceRangeLabel(priceRange as any)}
                                    </p>
                                )}
                                {/* Tipo de ambiente */}
                                {ambienteList.length > 0 && (
                                    <div className="mt-2">
                                        <span className="font-semibold text-xs">{t('placeDetail.environmentTypeLabel')}</span>
                                        <ul className="flex flex-wrap gap-2 mt-1">
                                            {ambienteList.map((amb: string, idx: number) => (
                                                <li key={idx} className="bg-gray-700 px-1 py-1 rounded text-xs">{getEnvironmentLabel(amb)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <span className="ml-auto bg-[#48464C] text-white text-xs px-2 py-1 rounded">{type}</span>
                        </div>

                        {/* Horário de funcionamento */}
                        <div className="px-0 pt-2 pb-8">
                            <div className="flex items-center justify-between">
                                <SectionHeading title={t('placeDetail.hoursTitle')} underline={false} sizeClass="text-sm sm:text-lg" className="flex-1" />
                                <div className="flex flex-col items-end justify-center gap-1 mt-8">
                                    {isOpenNow ? (
                                        <span className="bg-green-600 text-white text-xs px-4 py-1 rounded">{t('placeDetail.openNow')}</span>
                                    ) : (
                                        <span className="bg-red-600 text-white text-xs px-4 py-1 rounded">{t('placeDetail.closedNow')}</span>
                                    )}
                                    <span
                                        className="text-sm sm:text-base text-black cursor-pointer pt-2"
                                        onClick={onShowOpeningHours}
                                    >
                                        {t('placeDetail.viewHours')}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 space-y-2 mb-2">
                                {openingPatternId === 'CHECK_AVAILABILITY_DAYTIME' ? (
                                    <div className="text-sm text-gray-700">{t('openingHours.checkAvailabilityMessage')}</div>
                                ) : (
                                    openingDays.map((day, idx) => {
                                        const normalized = String(day).toLowerCase();
                                        const isLarge = /domingo|sábado|sabado|feriado|segunda/.test(normalized);
                                        const boxSizeClass = isLarge ? 'w-5 h-5 sm:w-5 sm:h-5' : 'w-4 h-4 sm:w-4 sm:h-4';
                                        return (
                                            <div key={idx} className="flex items-center">
                                                <span
                                                    aria-hidden="true"
                                                    className={`inline-flex items-center justify-center rounded-sm bg-green-600 mr-2 flex-shrink-0 ${boxSizeClass}`}
                                                >
                                                    <FaCheck className="text-white text-[10px] sm:text-xs" />
                                                </span>
                                                <span className="text-sm text-gray-800">{day}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Localização: renderiza endereços quando disponíveis; caso contrário usa os props legados */}
                        {((addresses && Array.isArray(addresses) && addresses.length > 0) || (address && address.trim().length > 0)) && (
                            <div className="border-t-2 border-bs-red px-0 py-8">
                                <div className="flex items-center justify-between">
                                    <SectionHeading title={t('placeDetail.locationTitle')} underline={false} sizeClass="text-sm sm:text-lg" className="flex-1" />
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{t('placeDetail.locationDescription')}</p>
                                <div className="mt-8 mb-4 space-y-6">
                                        {addresses && Array.isArray(addresses) && addresses.length > 0 ? (
                                        addresses.map((addr: any, idx: number) => {
                                            const neighborhoodText = addr?.neighborhood || '';
                                            const street = addr?.street || '';
                                            const number = addr?.number || '';
                                            const city = addr?.city || '';
                                            const postal = addr?.postalCode || addr?.postal_code || addr?.postal || addr?.cep || '';
                                            // Normalize 's/n' (sem número) display
                                            let displayNumber = number || '';
                                            try {
                                                const normalized = String(displayNumber).toLowerCase().replace(/[^a-z0-9]/g, '');
                                                if (normalized === 'sn' || normalized === 's' || normalized === 'n') {
                                                    displayNumber = 'sem número';
                                                }
                                            } catch (_) {
                                                // ignore
                                            }
                                            const streetParts = [street, displayNumber].filter(Boolean).join(', ');
                                            const streetText = postal ? `${streetParts}${streetParts ? ' - ' : ''}${postal}` : streetParts;
                                            const lat = toNumberOrNull(addr?.latitude);
                                            const lng = toNumberOrNull(addr?.longitude);
                                            const hasCoords = hasValidCoords(lat, lng);
                                            const fullAddress = [
                                                streetText,
                                                neighborhoodText,
                                                city,
                                                'SP',
                                                'Brasil',
                                            ].filter(Boolean).join(' - ');
                                            const mapsHref = hasCoords
                                                ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
                                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
                                            const uberHref = hasCoords
                                                ? `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`
                                                : `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(fullAddress)}`;

                                            return (
                                                <div key={idx} className="flex items-start w-full">
                                                    <div className="w-full">
                                                        <div>
                                                            {addresses.length > 1 ? (
                                                                <div className="mb-1">
                                                                    <div className="flex items-center">
                                                                        {addr?.isMainUnity && <FaStar className="mr-2 text-yellow-400" />}
                                                                        <span className="font-bold uppercase text-black">Unidade {neighborhoodText}</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <span className="font-bold uppercase text-black">{neighborhoodText}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-sm sm:text-sm text-gray-800">{t('placeDetail.streetPrefix')} {streetText}</div>
                                                        <div className="mt-3 flex flex-row flex-nowrap items-stretch gap-2 w-full">
                                                            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center bg-bs-red text-white px-2 py-2 sm:px-3 sm:py-2 rounded font-bold text-xs sm:text-sm text-center">
                                                                <FaMapMarkerAlt className="mr-2" /> {t('placeDetail.googleMapsButton')}
                                                            </a>
                                                            <a href={uberHref} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center bg-[#0F0D13] text-white px-2 py-2 sm:px-3 sm:py-2 rounded font-bold text-xs sm:text-sm text-center">
                                                                <img src={icUber} alt="uber" className="w-4 h-4 mr-2" /> {openUberLabel}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex items-start w-full">
                                            <div className="w-full">
                                                <div>
                                                    <span className="font-bold uppercase text-black">{neighborhood}</span>
                                                </div>
                                                <div className="text-sm sm:text-sm text-gray-800">{t('placeDetail.streetPrefix')} {String(address || '').replace(/\bs\/n\b/ig, 'sem número')}</div>
                                                <div className="mt-3 flex flex-row flex-nowrap items-stretch gap-2 w-full">
                                                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center bg-bs-red text-white px-2 py-2 sm:px-3 sm:py-2 rounded font-bold text-xs sm:text-sm text-center">
                                                        <FaMapMarkerAlt className="mr-2" /> {t('placeDetail.googleMapsButton')}
                                                    </a>
                                                    <a href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(address || '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center bg-[#0F0D13] text-white px-2 py-2 sm:px-3 sm:py-2 rounded font-bold text-xs sm:text-sm text-center">
                                                        <img src={icUber} alt="uber" className="w-4 h-4 mr-2" /> {openUberLabel}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
            </section>

            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] mt-4">
                <div className="mx-auto max-w-5xl px-4 sm:px-12 py-8 sm:py-10 h-full flex flex-col justify-between text-white">
                        <div>
                            {instagramUrl && instagramUrl.trim().length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-bold uppercase text-white">{t('placeDetail.instagramTitle')}</h3>
                                    <p className="text-xs sm:text-sm text-gray-300 mt-1">{t('placeDetail.instagramSubtitle')}</p>
                                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold mt-3">
                                        <FaInstagram className="mr-2" /> {t('placeDetail.follow')}
                                    </a>
                                </div>
                            )}

                                    {phones && phones.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="font-bold uppercase text-white">{t('placeDetail.phoneTitle')}</h3>
                                            <p className="text-xs sm:text-sm text-gray-300 mt-1">{t('placeDetail.phonesSubtitle')}</p>
                                            <div className="mt-3 space-y-2">
                                                {phones.map((p, idx) => {
                                                    const raw = String(p?.number || '').trim();
                                                    if (!raw) return null;
                                                    const clean = raw.replace(/[^0-9+]/g, '');
                                                    const telHref = `tel:${clean}`;
                                                    const waHref = `https://wa.me/${clean.replace(/^\+/, '')}`;
                                                    return (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <a href={telHref} aria-label={`call-${idx}`} className="inline-flex items-center bg-bs-red text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold text-xs sm:text-sm">
                                                                <FaPhone className="mr-2" />Ligar
                                                            </a>
                                                            {p.isWhatsApp && (
                                                                <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label={`whatsapp-${idx}`} className="inline-flex items-center bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold text-xs sm:text-sm">
                                                                    <FaWhatsapp className="mr-2" />WhatsApp
                                                                </a>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                            {menuUrl && menuUrl.trim().length > 0 && (
                                <div className="mt-8">
                                    <h3 className="font-bold uppercase text-white">{t('placeDetail.menuTitle')}</h3>
                                    <p className="text-xs sm:text-sm text-gray-300 mt-1">{t('placeDetail.menuSubtitle')}</p>
                                    <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold mt-3">
                                        {t('placeDetail.menuButton')}
                                    </a>
                                </div>
                            )}

                            {websiteUrl && websiteUrl.trim().length > 0 && (
                                <div className="mt-8">
                                    <h3 className="font-bold uppercase text-white">{t('placeDetail.websiteTitle')}</h3>
                                    <p className="text-xs sm:text-sm text-gray-300 mt-1">{t('placeDetail.websiteSubtitle')}</p>
                                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold mt-3">
                                        {t('placeDetail.websiteButton')}
                                    </a>
                                </div>
                            )}
                        </div>

                        {notes && notes.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-bold uppercase text-white">{t('placeDetail.notesTitle')}</h3>
                                <ul className="list-disc ml-5 text-sm text-gray-200">
                                    {notes.map((note, idx) => (
                                        <li key={idx}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </div>
            </section>
            {/* Footer */}
            <div className="bg-black border-t-2 border-bs-red py-3 px-4 flex items-center justify-center">
                <FaExclamationTriangle className="mr-2 text-white" />
                <a
                    href={`mailto:wallace.baldenebre@gmail.com?subject=${encodeURIComponent(`Reportar um problema do local ${name}`)}`}
                    className="text-white font-bold"
                >
                    {t('placeDetail.reportProblem')}
                </a>
            </div>
        </div>
    );
}