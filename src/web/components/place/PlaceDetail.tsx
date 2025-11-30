import React from "react";
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { getPriceRangeLabel } from "@/core/domain/enums/priceRangeLabel";
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { FaArrowLeft, FaInstagram, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";
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
    notes: string[];
    onBack: () => void;
    foodStyle?: string[];
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
    notes,
    onBack,
    onShowOpeningHours,
    isAlreadyVisited,
    foodStyle = [],
    tags = [],
}) => {
    const { t } = useTranslation();
    const [showVisitModal, setShowVisitModal] = React.useState(false);

    // Ambiente: foodStyle para RESTAURANT, tags para outros
    const ambienteList: string[] = type === "RESTAURANT" ? foodStyle : tags;

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            {/* Top Bar - apenas botão Voltar */}
            <div className="bg-black relative border-b-2 border-bs-red px-4 sm:px-12">
                <div className="mx-auto max-w-5xl flex items-center px-4 pt-6 sm:pt-12 pb-4">
                    <button onClick={onBack} className="text-white text-lg font-bold flex items-center">
                        <FaArrowLeft className="mr-2" /> {t('common.back')}
                    </button>
                    {/* Chips de status */}
                    <div className="ml-auto flex gap-2">
                        {isAlreadyVisited ? (
                            <button
                                className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded shadow flex items-center"
                                onClick={() => setShowVisitModal(true)}
                            >
                                {t('placeDetail.alreadyVisited')}
                            </button>
                        ) : (
                            <button
                                className="bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded shadow flex items-center border border-yellow-600"
                                onClick={() => setShowVisitModal(true)}
                            >
                                {t('placeDetail.notVisited')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
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

            {/* Main Content */}
            <div className="flex-1 bg-[#F5F5F5] text-black flex flex-col min-h-0">
                <div className="px-4 sm:px-12">
                    <div className="mx-auto max-w-5xl py-2">
                        <div className="border-b-2 border-bs-red px-1 pt-6 sm:pt-10 pb-6 sm:pb-10 flex items-center">
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
                        <div className="px-1 py-8">
                            <div className="flex items-center justify-between">
                                <SectionHeading title={t('placeDetail.hoursTitle')} underline={false} sizeClass="text-sm sm:text-lg" className="flex-1" />
                                <span
                                    className="text-xs text-black cursor-pointer"
                                    onClick={onShowOpeningHours}
                                >
                                    {t('placeDetail.viewHours')}
                                </span>
                            </div>
                            <div className="mt-2 space-y-1">
                                {openingDays.map((day, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <input type="checkbox" checked readOnly className="accent-green-500 mr-2" />
                                        <span className="text-sm text-gray-800">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Localização: renderiza endereços quando disponíveis; caso contrário usa os props legados */}
                        {((addresses && Array.isArray(addresses) && addresses.length > 0) || (address && address.trim().length > 0)) && (
                            <div className="border-t-2 border-bs-red px-1 py-8">
                                <div className="flex items-center justify-between mb-2">
                                    <SectionHeading title={t('placeDetail.locationTitle')} underline={false} sizeClass="text-sm sm:text-lg" className="flex-1" />
                                    {isOpenNow ? (
                                        <span className="bg-green-600 text-white text-xs px-4 py-1 rounded">{t('placeDetail.openNow')}</span>
                                    ) : (
                                        <span className="bg-red-600 text-white text-xs px-4 py-1 rounded">{t('placeDetail.closedNow')}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{t('placeDetail.locationDescription')}</p>
                                <div className="mt-4 mb-4 space-y-4">
                                    {addresses && Array.isArray(addresses) && addresses.length > 0 ? (
                                        addresses.map((addr: any, idx: number) => {
                                            const neighborhoodText = addr?.neighborhood || '';
                                            const streetText = `${addr?.street || ''}${addr?.number ? ', ' + addr.number : ''}`.trim();
                                            const mapsHref = (addr?.latitude && addr?.longitude)
                                                ? `https://maps.google.com/?q=${addr.latitude},${addr.longitude}`
                                                : `https://maps.google.com/?q=${encodeURIComponent(streetText)}`;
                                            return (
                                                <div key={idx} className="flex items-start justify-between">
                                                    <div>
                                                        <div>
                                                            <span className="font-bold uppercase text-black">{neighborhoodText}</span>
                                                        </div>
                                                        <div className="text-sm sm:text-sm text-gray-800">{t('placeDetail.streetPrefix')} {streetText}</div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold">
                                                            <FaMapMarkerAlt className="mr-2" /> {t('placeDetail.googleMapsButton')}
                                                        </a>
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
                                            </div>
                                            <div className="flex-shrink-0">
                                                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold">
                                                    <FaMapMarkerAlt className="mr-2" /> {t('placeDetail.googleMapsButton')}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-4 sm:px-12 py-2 flex-1 bg-[#48464C] mt-4">
                    <div className="mx-auto max-w-5xl py-8 sm:py-10 h-full flex flex-col justify-between text-white">
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold uppercase text-white">{t('placeDetail.instagramTitle')}</h3>
                                    <p className="text-xs sm:text-sm text-gray-300">{t('placeDetail.instagramSubtitle')}</p>
                                </div>
                                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold">
                                    <FaInstagram className="mr-2" /> {t('placeDetail.follow')}
                                </a>
                            </div>
                            <div className="flex items-center justify-between mt-8">
                                <div>
                                    <h3 className="font-bold uppercase text-white">{t('placeDetail.menuTitle')}</h3>
                                    <p className="text-xs sm:text-sm text-gray-300">{t('placeDetail.menuSubtitle')}</p>
                                </div>
                                <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-3 py-1 sm:px-4 sm:py-2 rounded font-bold">
                                    {t('placeDetail.menuButton')}
                                </a>
                            </div>
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
                </div>
            </div>
            {/* Footer */}
            <div className="bg-black border-t-2 border-bs-red py-3 px-4 flex items-center justify-center">
                <FaExclamationTriangle className="mr-2 text-white" />
                <span className="text-white font-bold">{t('placeDetail.reportProblem')}</span>
            </div>
        </div>
    );
}