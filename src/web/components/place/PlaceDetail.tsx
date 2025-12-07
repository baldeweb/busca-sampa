import React from "react";
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { getPriceRangeLabel } from "@/core/domain/enums/priceRangeLabel";
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { FaInstagram, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";
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
    instagramUrl: string;
    menuUrl: string;
    websiteUrl?: string;
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
    instagramUrl,
    menuUrl,
    websiteUrl = "",
    notes,
    onBack,
    onShowOpeningHours,
    isAlreadyVisited,
    tags = [],
}) => {
    const { t, i18n } = useTranslation();
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
                                {t('placeDetail.visitModalParagraph')}<br /><br />
                                <span className="font-bold text-red-400">{t('placeDetail.neverEmphasis')}</span> {t('placeDetail.visitModalEnding')}
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
                                {openingDays.map((day, idx) => {
                                        const normalized = String(day).toLowerCase();
                                        const isLarge = /domingo|sábado|sabado|feriado|segunda/.test(normalized);
                                        return (
                                            <div key={idx} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked
                                                    readOnly
                                                    className={`accent-green-500 mr-2 ${isLarge ? 'w-5 h-5 sm:w-6 sm:h-6' : ''}`}
                                                />
                                                <span className="text-sm text-gray-800">{day}</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* Localização: renderiza endereços quando disponíveis; caso contrário usa os props legados */}
                        {((addresses && Array.isArray(addresses) && addresses.length > 0) || (address && address.trim().length > 0)) && (
                            <div className="border-t-2 border-bs-red px-0 py-8">
                                <div className="flex items-center justify-between">
                                    <SectionHeading title={t('placeDetail.locationTitle')} underline={false} sizeClass="text-sm sm:text-lg" className="flex-1" />
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{t('placeDetail.locationDescription')}</p>
                                <div className="mt-12 mb-4 space-y-4">
                                    {addresses && Array.isArray(addresses) && addresses.length > 0 ? (
                                        addresses.map((addr: any, idx: number) => {
                                            const neighborhoodText = addr?.neighborhood || '';
                                            const street = addr?.street || '';
                                            const number = addr?.number || '';
                                            const postal = addr?.postalCode || addr?.postal_code || addr?.postal || addr?.cep || '';
                                            const streetParts = [street, number].filter(Boolean).join(', ');
                                            const streetText = postal ? `${streetParts}${streetParts ? ' - ' : ''}${postal}` : streetParts;
                                            const hasCoords = addr?.latitude != null && addr?.longitude != null;
                                            const mapsHref = hasCoords
                                                ? `https://maps.google.com/?q=${addr.latitude},${addr.longitude}`
                                                : `https://maps.google.com/?q=${encodeURIComponent(streetText)}`;
                                            const uberHref = hasCoords
                                                ? `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${addr.latitude}&dropoff[longitude]=${addr.longitude}&dropoff[nickname]=${encodeURIComponent(name)}`
                                                : `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(streetText)}`;

                                            return (
                                                <div key={idx} className="flex items-start justify-between">
                                                    <div>
                                                        <div>
                                                            <span className="font-bold uppercase text-black">{neighborhoodText}</span>
                                                        </div>
                                                        <div className="text-sm sm:text-sm text-gray-800">{t('placeDetail.streetPrefix')} {streetText}</div>
                                                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                                                            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-2 py-2 sm:px-3 sm:py-2 rounded font-bold text-xs sm:text-sm">
                                                                <FaMapMarkerAlt className="mr-2" /> {t('placeDetail.googleMapsButton')}
                                                            </a>
                                                            <a href={uberHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-[#0F0D13] text-white px-2 py-2 sm:px-3 sm:py-2 rounded font-bold text-xs sm:text-sm">
                                                                <img src={icUber} alt="uber" className="w-4 h-4 mr-2" /> {openUberLabel}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div>
                                                    <span className="font-bold uppercase text-black">{neighborhood}</span>
                                                </div>
                                                <div className="text-sm sm:text-sm text-gray-800">{t('placeDetail.streetPrefix')} {address}</div>
                                                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-2 py-2 sm:px-3 sm:py-2 rounded font-bold text-xs sm:text-sm">
                                                        <FaMapMarkerAlt className="mr-2" /> {t('placeDetail.googleMapsButton')}
                                                    </a>
                                                    <a href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(address || '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-[#0F0D13] text-white px-2 py-2 sm:px-3 sm:py-2 rounded font-bold text-xs sm:text-sm">
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