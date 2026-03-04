import React from "react";
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { AppText } from '@/web/components/ui/AppText';
import { getPriceRangeLabel } from "@/core/domain/enums/priceRangeLabel";
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { FaInstagram, FaMapMarkerAlt, FaLink, FaPhone, FaWhatsapp, FaStar, FaCheck } from "react-icons/fa";
import { Toolbar } from '@/web/components/layout/Toolbar';
import icUber from '@/assets/imgs/icons/ic_uber.png';
import { useTranslation } from 'react-i18next';
import { AppButton } from "../ui/AppButton";
import { ReportProblemFooter } from '@/web/components/layout/ReportProblemFooter';

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

    const [isMobileOrTablet, setIsMobileOrTablet] = React.useState(false);

    React.useEffect(() => {
        try {
            if (typeof navigator === 'undefined' || typeof window === 'undefined') {
                setIsMobileOrTablet(false);
                return;
            }
            const ua = navigator.userAgent || '';
            const mobileRegex = /Mobi|Android|iPhone|iPad|Tablet|Mobile/i;
            const smallViewport = window.matchMedia ? window.matchMedia('(max-width: 1024px)').matches : window.innerWidth <= 1024;
            setIsMobileOrTablet(mobileRegex.test(ua) || smallViewport);
        } catch (e) {
            setIsMobileOrTablet(false);
        }
    }, []);

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

    const formatPhoneForDisplay = (rawNumber: string) => {
        const rawTrimmed = String(rawNumber || '').trim();
        if (!rawTrimmed) return '';

        const digits = rawTrimmed.replace(/\D/g, '');
        if (digits.startsWith('11') || digits.startsWith('12')) {
            const ddd = digits.slice(0, 2);
            const rest = digits.slice(2);

            if (rest.length === 9) {
                return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
            }
            if (rest.length === 8) {
                return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
            }

            // If it starts with 11/12 but doesn't match 8/9 digits, at least apply the parentheses rule.
            return `(${ddd}) ${rest}`;
        }

        // Fallback: keep exactly what comes from JSON.
        return rawTrimmed;
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
            {/* Top Bar - Toolbar (consistent with Neighborhood list) */}
            <Toolbar onBack={onBack} showVisitedButton={true} isAlreadyVisited={Boolean(isAlreadyVisited)} onVisitedClick={() => setShowVisitModal(true)} />
            {/* Modal explicativo */}
            {showVisitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-bs-card rounded-lg shadow-lg w-[90vw] max-w-md border border-white">
                        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-bs-red">
                            <AppText variant="title-dark" className="flex-1 text-center">
                                {t('placeDetail.visitModalTitle')}
                            </AppText>
                            <AppButton 
                                variant="close"
                                onClick={() => setShowVisitModal(false)} 
                                className="btn-close-round">
                                ×
                            </AppButton>
                        </div>
                        <AppText variant="body-dark" className="p-5 text-center">
                            {isAlreadyVisited ? (
                                t('placeDetail.visitedModalParagraph')
                            ) : (
                                <>
                                    {t('placeDetail.visitModalParagraph')}<br /><br />
                                    <span>{t('placeDetail.neverEmphasis')}</span> {t('placeDetail.visitModalEnding')}
                                </>
                            )}
                        </AppText>
                    </div>
                </div>
            )}

            {/* Main Content (match NeighborhoodList full-bleed + inner padding) */}
            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF] text-black">
                <div className="mx-auto max-w-5xl px-0 sm:px-12 pt-0 pb-6 sm:pb-12">
                    <SectionHeading
                        title={name}
                        underline={false}
                        layout="stackOnMobile"
                        trailing={(
                            <div className="sm:ml-auto flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-1 shrink-0">
                                {isOpenNow ? (
                                    <AppText variant="body-dark" className="bg-green-600 px-4 py-2 rounded">{t('placeDetail.openNow')}</AppText>
                                ) : (
                                    <AppText variant="body-dark" className="bg-red-600 px-4 py-1 rounded">{t('placeDetail.closedNow')}</AppText>
                                )}
                                <AppText variant="body-dark" className="bg-[#212121] px-2 py-1 rounded">{type}</AppText>
                            </div>
                        )}
                    >
                        <AppText variant="subtitle-light">{description}</AppText>
                        {priceRange && (
                            <AppText 
                                variant="subtitle-light">
                                {t('placeDetail.priceLabel')} {getPriceRangeLabel(priceRange as any)}
                            </AppText>
                        )}
                        {/* Tipo de ambiente */}
                        {ambienteList.length > 0 && (
                            <div className="mt-2">
                                <AppText variant="subtitle-light">
                                    {t('placeDetail.environmentTypeLabel')}
                                </AppText>
                                <ul className="flex flex-wrap gap-2 mt-1">
                                    {ambienteList.map((amb: string, idx: number) => (
                                        <AppText
                                            key={idx}
                                            variant="selected-light"
                                            className="px-1 py-1 rounded"
                                        >
                                            {getEnvironmentLabel(amb)}
                                        </AppText>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </SectionHeading>

                    {/* Horário de funcionamento */}
                    <div className="px-4 sm:px-4 pt-2 pb-8 mt-8">
                        <div className="flex items-center justify-between">
                            <SectionHeading title={t('placeDetail.hoursTitle')} underline={false} className="flex-1" card={false} tone="light" />
                            <div className="flex flex-col items-end justify-center gap-1">
                                <button
                                    type="button"
                                    className="px-3 py-1 text-[0.7rem] sm:text-[0.75rem] font-semibold"
                                    onClick={onShowOpeningHours}
                                >
                                    {t('placeDetail.viewHours')}
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 space-y-2 mb-2">
                            {openingPatternId === 'CHECK_AVAILABILITY_DAYTIME' ? (
                                <AppText variant="body-light">{t('openingHours.checkAvailabilityMessage')}</AppText>
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
                                                <FaCheck className="text-white text-[10px]" />
                                            </span>
                                            <AppText variant="body-light">{day}</AppText>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Localização: renderiza endereços quando disponíveis; caso contrário usa os props legados */}
                    {((addresses && Array.isArray(addresses) && addresses.length > 0) || (address && address.trim().length > 0)) && (
                        <div className="px-4 sm:px-4 py-8">
                            <div className="flex items-center justify-between">
                                <SectionHeading
                                    title={t('placeDetail.locationTitle')}
                                    subtitle={t('placeDetail.locationDescription')}
                                    underline={false}
                                    className="flex-1"
                                    card={false}
                                    tone="light"
                                />
                            </div>
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
                                                                    <AppText variant="subtitle-light">•Unidade {neighborhoodText}</AppText>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <AppText variant="subtitle-light">{neighborhoodText}</AppText>
                                                        )}
                                                    </div>
                                                    <AppText variant="subtitle-light">{t('placeDetail.streetPrefix')} {streetText}</AppText>
                                                    <div className="mt-3 flex flex-row flex-nowrap items-stretch gap-2 w-full">
                                                        {isMobileOrTablet ? (
                                                            <>
                                                                <AppButton
                                                                    variant="square"
                                                                    size="md"
                                                                    onClick={() => window.open(mapsHref, '_blank', 'noopener noreferrer')}
                                                                    className="inline-flex flex-1 items-center justify-center px-2 py-2 sm:px-3 sm:py-4"
                                                                >
                                                                    <FaMapMarkerAlt className="mr-2" /> {t('placeDetail.googleMapsButton')}
                                                                </AppButton>

                                                                <AppButton
                                                                    variant="uber"
                                                                    size="md"
                                                                    onClick={() => window.open(uberHref, '_blank', 'noopener noreferrer')}
                                                                    className="inline-flex flex-1 items-center justify-center px-3 py-3 sm:px-4 sm:py-3 3"
                                                                >
                                                                    <img src={icUber} alt="uber" className="w-4 h-4 mr-2" /> {openUberLabel}
                                                                </AppButton>
                                                            </>
                                                        ) : (
                                                            <AppButton
                                                                variant="action"
                                                                size="md"
                                                                onClick={() => window.open(mapsHref, '_blank', 'noopener noreferrer')}
                                                                className="inline-flex flex-1 items-center justify-center px-3 py-3 sm:px-4 sm:py-3 3"
                                                            >
                                                                <FaMapMarkerAlt className="mr-2" /> {t('placeDetail.googleMapsButton')}
                                                            </AppButton>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex items-start w-full">
                                        <div className="w-full">
                                            <AppText variant="subtitle-light">{neighborhood}</AppText>
                                            <AppText variant="body-light">{t('placeDetail.streetPrefix')} {String(address || '').replace(/\bs\/n\b/ig, 'sem número')}</AppText>
                                            <div className="mt-3 flex flex-row flex-nowrap items-stretch gap-2 w-full">
                                                {isMobileOrTablet ? (
                                                    <>
                                                        <AppButton
                                                            variant="uber"
                                                            size="md"
                                                            onClick={() => window.open(`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent([address, neighborhood].filter(Boolean).join(' - '))}`, '_blank', 'noopener noreferrer')}
                                                            className="inline-flex flex-1 items-center justify-center px-3 py-3 sm:px-4 sm:py-3 3"
                                                        >
                                                            <img src={icUber} alt="uber" className="w-4 h-4 mr-2" /> {openUberLabel}
                                                        </AppButton>
                                                    </>
                                                ) : (
                                                    <AppButton
                                                        variant="square"
                                                        size="md"
                                                        onClick={() => window.open(googleMapsUrl, '_blank', 'noopener noreferrer')}
                                                        className="inline-flex w-full items-center justify-center px-3 py-4 sm:px-4 sm:py-3"
                                                    >
                                                        {t('placeDetail.googleMapsButton')}
                                                    </AppButton>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            { /* Midias Sociais */}
            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#212121] mt-4">
                <div className="mx-auto max-w-5xl px-4 sm:px-12 py-8 sm:py-10 h-full flex flex-col justify-between text-white">
                    <div>
                        {instagramUrl && instagramUrl.trim().length > 0 && (
                            <div className="mt-4">
                                <AppText variant="title-dark" className="mt-2 break-all">{t('placeDetail.instagramTitle')}</AppText>
                                <AppText variant="subtitle-dark">{t('placeDetail.instagramSubtitle')}</AppText>
                                <AppButton
                                    variant="square"
                                    size="md"
                                    onClick={() => window.open(instagramUrl, '_blank', 'noopener noreferrer')}
                                    className="inline-flex items-center px-4 py-3 sm:px-4 sm:py-3 mt-3"
                                >
                                    <FaInstagram className="mr-2" /> {t('placeDetail.follow')}
                                </AppButton>
                            </div>
                        )}

                        {phones && phones.length > 0 && (
                            <div className="mt-8">
                                <AppText variant="title-dark" className="mt-2 break-all">{t('placeDetail.phoneTitle')}</AppText>
                                <AppText variant="subtitle-dark">{t('placeDetail.phonesSubtitle')}</AppText>
                                <div className="mt-3 space-y-2">
                                    {phones.map((p, idx) => {
                                        const raw = String(p?.number || '').trim();
                                        if (!raw) return null;
                                        const clean = raw.replace(/[^0-9+]/g, '');
                                        const telHref = `tel:${clean}`;
                                        const waHref = `https://wa.me/${clean.replace(/^\+/, '')}`;
                                        const phoneDisplay = formatPhoneForDisplay(raw);
                                        return (
                                            <div key={idx} className="flex items-center gap-2">
                                                {p.isWhatsApp && (
                                                    <AppButton
                                                        variant="whatsapp"
                                                        size="md"
                                                        onClick={() => window.open(waHref, '_blank', 'noopener noreferrer')}
                                                        className="inline-flex items-center px-4 py-3 sm:px-4 sm:py-3n"
                                                    >
                                                        <FaWhatsapp className="mr-2" /> {t('placeDetail.whatsappButton')}
                                                    </AppButton>
                                                )}
                                                <AppButton
                                                    variant="action"
                                                    size="md"
                                                    onClick={() => window.open(telHref, '_blank', 'noopener noreferrer')}
                                                    className="inline-flex items-center px-4 py-3 sm:px-4 sm:py-3"
                                                >
                                                    <FaPhone className="mr-2" /> {t('placeDetail.onCall')}
                                                </AppButton>
                                                {phoneDisplay && (
                                                    <AppText variant="selected-dark">
                                                        {phoneDisplay}
                                                    </AppText>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {menuUrl && menuUrl.trim().length > 0 && (
                            <div className="mt-8">
                                <AppText variant="title-dark" className="mt-2 break-all">{t('placeDetail.menuTitle')}</AppText>
                                <AppText variant="subtitle-dark">{t('placeDetail.menuSubtitle')}</AppText>
                                <AppButton
                                    variant="action"
                                    size="md"
                                    onClick={() => window.open(websiteUrl, '_blank', 'noopener noreferrer')}
                                    className="inline-flex items-center px-4 py-3 mt-3"
                                >
                                    <FaLink className="mr-2" />{t('placeDetail.menuButton')}
                                </AppButton>
                            </div>
                        )}

                        {websiteUrl && websiteUrl.trim().length > 0 && (
                            <div className="mt-8">
                                <AppText variant="title-dark" className="mt-2 break-all">{t('placeDetail.websiteTitle')}</AppText>
                                <AppText variant="subtitle-dark">{t('placeDetail.websiteSubtitle')}</AppText>
                                <AppButton
                                    variant="action"
                                    size="md"
                                    onClick={() => window.open(websiteUrl, '_blank', 'noopener noreferrer')}
                                    className="inline-flex items-center px-4 py-3 mt-3"
                                >
                                    <FaLink className="mr-2" /> {t('placeDetail.websiteButton')}
                                </AppButton>
                            </div>
                        )}
                    </div>

                    {notes && notes.length > 0 && (
                        <div className="mt-6">
                            <AppText variant="title-dark" className="mt-2 break-all">{t('placeDetail.notesTitle')}</AppText>
                            <ul className="mt-1">
                                {notes.map((note, idx) => (
                                    <AppText variant="subtitle-dark" key={idx}>• {note}</AppText>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <ReportProblemFooter subject={`Reportar um problema na página de detalhes do local ${name}`} />
        </div>
    );
}