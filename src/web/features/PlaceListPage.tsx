import React, { useState, useMemo } from "react";
import { useDocumentTitle } from "@/web/hooks/useDocumentTitle";
import { BackHeader } from '@/web/components/layout/BackHeader';
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import { useOpeningPatterns } from "@/web/hooks/useOpeningPatterns";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ActionButton } from '@/web/components/ui/ActionButton';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { EnvironmentSelectModal } from '@/web/components/place/EnvironmentSelectModal';
import flagSp from '@/assets/imgs/flags/flag_sp.png';
import icBars from '@/assets/imgs/icons/ic_bars.png';
import icCoffee from '@/assets/imgs/icons/ic_coffee.png';
import icFree from '@/assets/imgs/icons/ic_free.png';
import icNightlife from '@/assets/imgs/icons/ic_nightlife.png';
import icNature from '@/assets/imgs/icons/ic_nature.png';
import icRestaurants from '@/assets/imgs/icons/ic_restaurants.png';
import icTouristSpot from '@/assets/imgs/icons/ic_tourist_spot.png';
import icOpenToday from '@/assets/imgs/icons/ic_open_today.png';

const ORDER_OPTIONS = [
    { value: "name-asc" },
    { value: "name-desc" },
    { value: "neighborhood-asc" },
    { value: "neighborhood-desc" },
];

export const PlaceListPage: React.FC = () => {
    const { t } = useTranslation();
    const { type: routeType } = useParams();
    const routeTypeRaw = routeType || "restaurants";
    const routeTypeLower = routeTypeRaw.toLowerCase();
    const navigate = useNavigate();
    // Carrega todas as categorias
    const { data: restaurants } = useRecommendationList("restaurants");
    const { data: bars } = useRecommendationList("bars");
    const { data: coffees } = useRecommendationList("coffees");
    const { data: nightlife } = useRecommendationList("nightlife");
    const { data: nature } = useRecommendationList("nature");
    const { data: touristSpots } = useRecommendationList("tourist-spot");
    const { data: openingPatternsData } = useOpeningPatterns();
    const openingPatterns = openingPatternsData || [];

    // Junta todos os lugares em um único array para filtros especiais
    const allPlaces = useMemo(() => [
        ...restaurants,
        ...bars,
        ...coffees,
        ...nightlife,
        ...nature,
        ...touristSpots,
    ], [restaurants, bars, coffees, nightlife, nature, touristSpots]);

    // Mapeia slug para tipo utilizado nos dados
    const typeMap: Record<string, string> = {
        restaurants: "RESTAURANT",
        bars: "BAR",
        coffees: "COFFEE",
        nightlife: "NIGHTLIFE",
        nature: "NATURE",
        "tourist-spot": "TOURIST_SPOT",
        free: "FREE",
    };
    const mappedType = typeMap[routeTypeLower] || routeTypeLower.toUpperCase() || "RESTAURANT";

    // Filtra pelo tipo da URL
    const filteredByType = useMemo(() => {
        if ((routeType || "").toLowerCase() === "restaurants") {
            return restaurants;
        }
        if ((routeType || "").toLowerCase() === "gratuito" || mappedType === "FREE") {
            return allPlaces.filter(p => p.priceRange === "FREE");
        }
        // NOTE: removed 'aberto-agora' special route — handled via other flows.
        if ((routeType || "").toLowerCase() === "abrem-hoje") {
            // places that have opening times for today (even if closed now)
            return allPlaces.filter(place => getOpenTimesForToday(place).length > 0);
        }
        return allPlaces.filter(p => p.type === mappedType);
    }, [allPlaces, mappedType, routeType, restaurants, openingPatterns]);

    // Chips de ambiente (tags únicos)
    const environments = useMemo(() => {
        const envSet = new Set<string>();
        filteredByType.forEach(p => {
            p.tags?.forEach((t: string) => envSet.add(t));
        });
        const tagArr = Array.from(envSet).map(e => ({ label: getEnvironmentLabel(e), value: e }));
        if (tagArr.length > 0) {
            tagArr.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
            return tagArr;
        }

        // Fallback: se não houver tags, use os tipos de lugar presentes (ex: TOURIST_SPOT, RESTAURANT)
        const typeSet = new Set<string>();
        filteredByType.forEach(p => { if (p.type) typeSet.add(p.type); });
        const typeArr = Array.from(typeSet).map(e => ({ label: getPlaceTypeLabel(e), value: e }));
        typeArr.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
        return typeArr;
    }, [filteredByType]);

    // Helper: get opening times for today for a place (returns array of open times strings like '08:00')
    function getOpenTimesForToday(place: any): string[] {
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
        const currentDay = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"][now.getDay()];
        const opens = periods
            .filter((p: any) => p.open && (p.days?.includes(currentDay) || p.days?.includes('EVERYDAY')))
            .map((p: any) => p.open)
            .filter(Boolean);
        // unique + sort
        const uniq = Array.from(new Set(opens));
        uniq.sort();
        return uniq;
    }

    // Mapeia o tipo atual para o ícone usado no cabeçalho e no cartão 'Todos'
    const headerIcon = (() => {
        switch (mappedType) {
            case 'FREE': return icFree;
            case 'BAR': return icBars;
            case 'COFFEE': return icCoffee;
            case 'NIGHTLIFE': return icNightlife;
            case 'NATURE': return icNature;
            case 'RESTAURANT': return icRestaurants;
            case 'TOURIST_SPOT': return icTouristSpot;
            case 'ABREM-HOJE':
            case 'ABREM_HOJE':
            case 'OPEN_TODAY':
                return icOpenToday;
            default: return flagSp;
        }
    })();

    const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
    const [order, setOrder] = useState(ORDER_OPTIONS[0].value);
    const [showOrderDropdown, setShowOrderDropdown] = useState(false);
    const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);

    // Filtro de ambiente
    const filteredPlaces = useMemo(() => {
        if (!selectedEnv) return filteredByType;
        const normalize = (s: any) => String(s || '').trim().toLowerCase();
        const sel = normalize(selectedEnv);
        return filteredByType.filter(p => {
            if (normalize(p.type) === sel) return true;
            if (Array.isArray(p.tags)) {
                for (const tg of p.tags) if (normalize(tg) === sel) return true;
            }
            return false;
        });
    }, [filteredByType, selectedEnv]);

    // Debug: log selected environment and result counts to aid troubleshooting
    React.useEffect(() => {
        if (!selectedEnv) return;
        try {
            console.log(`[PlaceListPage] selectedEnv=${selectedEnv} filteredByType=${filteredByType.length} result=${filteredPlaces.length} sampleIds=${filteredPlaces.slice(0,5).map(p=>p.id).join(',')}`);
        } catch (_) {}
    }, [selectedEnv, filteredByType, filteredPlaces]);

    // Debug: print available environments (label/value) to verify what the UI shows
    React.useEffect(() => {
        try {
            console.log('[PlaceListPage] environments=', environments.map(e => ({ label: e.label, value: e.value })));
            const sample = filteredByType.slice(0, 5);
            console.log('[PlaceListPage] filteredByType sample (5):', sample.map(p => ({ id: p.id, name: p.name, type: p.type, tags: p.tags })));
        } catch (_) {}
    }, [environments, filteredByType]);

    // Debug: test filter matching when selectedEnv changes
    React.useEffect(() => {
        if (!selectedEnv) return;
        try {
            const normalize = (s: any) => String(s || '').trim().toLowerCase();
            const sel = normalize(selectedEnv);
            const matches = filteredByType.filter(p => {
                if (normalize(p.type) === sel) return true;
                if (Array.isArray(p.tags)) {
                    for (const tg of p.tags) if (normalize(tg) === sel) return true;
                }
                return false;
            });
            console.log(`[PlaceListPage] selectedEnv="${selectedEnv}" normalized="${sel}" matches=${matches.length} samples=[${matches.slice(0,3).map(p=>`${p.id}:${p.name}`).join(', ')}]`);
        } catch (e) { console.error('Debug filter error:', e); }
    }, [selectedEnv, filteredByType]);

    // Ordenação
    const sortedPlaces = useMemo(() => {
        const arr = [...filteredPlaces];
        switch (order) {
            case "name-asc":
                arr.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                arr.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "neighborhood-asc":
                arr.sort((a, b) => {
                    const na = a.addresses?.[0]?.neighborhood || "";
                    const nb = b.addresses?.[0]?.neighborhood || "";
                    return na.localeCompare(nb);
                });
                break;
            case "neighborhood-desc":
                arr.sort((a, b) => {
                    const na = a.addresses?.[0]?.neighborhood || "";
                    const nb = b.addresses?.[0]?.neighborhood || "";
                    return nb.localeCompare(na);
                });
                break;
        }
        return arr;
    }, [filteredPlaces, order]);


    // Título dinâmico: prefira um rótulo passado via navigation state (vindo do HomePage),
    // caso contrário use a tradução baseada no tipo.
    const location = useLocation();
    const navLabel = (location.state as any)?.label as string | undefined;
    const placeTypeForTitle = mappedType;
    const title = navLabel || t(`placeType.${placeTypeForTitle}`);
    useDocumentTitle(title);

    // Subtítulo dinâmico usando chaves de tradução e textos por tipo
    const article = t(`placeList.article.${placeTypeForTitle}`, { defaultValue: '' });
    const nounTranslated = t(`placeList.noun.${placeTypeForTitle}`, { defaultValue: (navLabel || title).toLowerCase() });
    const subtitle = t('placeList.subtitleTemplate', { article, noun: nounTranslated });

    // DEBUG LOGS (diagnóstico)
    React.useEffect(() => {
        console.log("routeType param:", routeType);
        console.log("mappedType:", mappedType);
        console.log("filteredByType length:", filteredByType.length);
    }, [routeType, mappedType, filteredByType]);

    const isOpensToday = routeTypeLower === 'abrem-hoje' || mappedType === 'ABREM-HOJE';

    // Helper: get raw periods for a relative day (0 = today, 1 = tomorrow)
    function getPeriodsForDay(place: any, dayOffset = 0): any[] {
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

    function getPeriodsForToday(place: any): any[] {
        return getPeriodsForDay(place, 0);
    }

    // Helper: compute display value for the opening column per user's request
    function getOpeningDisplayForToday(place: any): string {
        const periods = getPeriodsForToday(place);
        // If there is no patternId and no custom overrides, explicitly show 'hours unavailable'
        if (!place.openingHours?.patternId && (!place.openingHours?.customOverrides || place.openingHours.customOverrides.length === 0)) {
            return t('placeList.hoursUnavailable', { defaultValue: 'Horário indisponível' });
        }
        if (!periods || periods.length === 0) return '-';

        // if currently open
        if (isOpenNow(periods)) return t('placeList.openNow', { defaultValue: 'Aberto agora' });

        // compute next opening time (minutes)
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }

        let nextOpenMinutes: number | null = null;
        let nextOpenStr: string | null = null;
        for (const p of periods) {
            if (!p.open) continue;
            const om = parseTime(p.open);
            if (om > currentMinutes && (nextOpenMinutes === null || om < nextOpenMinutes)) {
                nextOpenMinutes = om;
                nextOpenStr = p.open;
            }
        }

        if (nextOpenMinutes !== null && nextOpenStr) {
            const diff = nextOpenMinutes - currentMinutes;
            if (diff <= 60) return t('placeList.opensSoon', { defaultValue: 'Abre em instantes' });
            return nextOpenStr;
        }

        // No more openings today — check tomorrow's first opening and present it (better than '-')
        const tomorrowPeriods = getPeriodsForDay(place, 1);
        if (tomorrowPeriods && tomorrowPeriods.length > 0) {
            // find earliest open tomorrow
            let earliest: string | null = null;
            function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
            for (const p of tomorrowPeriods) {
                if (!p.open) continue;
                if (earliest === null || parseTime(p.open) < parseTime(earliest)) earliest = p.open;
            }
            if (earliest) return earliest; // small UX: show time (tomorrow)
        }

        return '-';
    }

    // Helper: pick a neighborhood string for a place (prefer main unity)
    function getPlaceNeighborhood(place: any): string | undefined {
        const addrs = place?.addresses;
        if (!addrs || !Array.isArray(addrs) || addrs.length === 0) return undefined;

        // prefer main unity neighborhood if present
        const main = addrs.find((a: any) => a.isMainUnity) || addrs[0];
        const candidateKeys = [/neighbou?rhood/i, /neighborhoodname/i, /bairro/i, /district/i, /suburb/i];

        function findNeighborhood(obj: any) {
            if (!obj) return undefined;
            // direct common key
            if (obj.neighborhood) return obj.neighborhood;
            // other potential keys
            for (const key of Object.keys(obj)) {
                for (const rx of candidateKeys) {
                    if (rx.test(key) && obj[key]) return obj[key];
                }
            }
            return undefined;
        }

        const mainNeighborhood = findNeighborhood(main);
        if (mainNeighborhood) return mainNeighborhood;

        // search other addresses for any neighborhood-like key
        for (const a of addrs) {
            const n = findNeighborhood(a);
            if (n) return n;
        }

        // final fallback: return city only if no neighborhood-like data exists
        for (const a of addrs) {
            if (a && a.city) return a.city;
        }
        // nothing found — emit a warning to aid debugging in production
        try {
            console.warn(`PlaceListPage: no neighborhood for place id=${place?.id}`, place?.addresses?.slice?.(0,3) || place?.addresses);
        } catch (_) {}
        return undefined;
    }

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            {/* Top Bar */}
            <BackHeader onBack={() => navigate(-1)} />
            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
                <div className="mx-auto max-w-5xl px-4 sm:px-12 py-6 sm:py-8 text-black">
                    {/* Título e descrição */}
                    <div>
                        <div className="flex items-start gap-4">
                            <img src={headerIcon} alt="flag" className="w-12 h-12 object-contain" />
                            <div>
                                <SectionHeading title={title} underline={false} sizeClass="text-lg sm:text-2xl text-black" />
                                <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{subtitle}</p>
                            </div>
                        </div>
                    </div>
                    {/* Grid de tipos de ambiente */}
                    {environments.length > 0 && (
                        <div className="bg-[#F5F5F5] text-black pb-4">
                            <h3 className="font-bold text-lg mb-3 pt-8">{t('placeList.environmentTitle') || 'Tipo de ambiente:'}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs w-full">
                                {/* Botão "Todos" */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedEnv(null);
                                    }}
                                    className={`w-full font-semibold uppercase rounded-md px-4 py-4 leading-tight transition-colors border shadow-sm ${
                                        selectedEnv === null 
                                            ? 'bg-bs-red text-white border-bs-red' 
                                            : 'bg-white text-black border-[#0F0D13]'
                                    }`}
                                >
                                    {t('common.all')}
                                </button>
                                {/* Primeiros 4 tipos em mobile, 8 em desktop */}
                                {environments.slice(0, 8).map((env, idx) => (
                                    <button
                                        key={env.value}
                                        type="button"
                                        onClick={() => {
                                            const next = selectedEnv === env.value ? null : env.value;
                                            setSelectedEnv(next);
                                        }}
                                        className={`w-full font-semibold uppercase rounded-md px-4 py-4 leading-tight transition-colors border shadow-sm ${
                                            selectedEnv === env.value 
                                                ? 'bg-bs-red text-white border-bs-red' 
                                                : 'bg-white text-black border-[#0F0D13]'
                                        } ${idx >= 4 ? 'hidden sm:block' : ''}`}
                                    >
                                        {env.label}
                                    </button>
                                ))}
                                {/* Botão "Ver mais" se houver mais de 4 em mobile ou mais de 8 em desktop */}
                                {environments.length > 4 && (
                                    <ActionButton
                                        type="button"
                                        onClick={() => setShowEnvironmentModal(true)}
                                        size="md"
                                        className={`w-full py-4 font-semibold text-base rounded-md ${environments.length > 8 ? '' : 'sm:hidden'}`}
                                    >
                                        {t('home.viewMore')}
                                    </ActionButton>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {/* Filtro de ordenação */}
            <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
                <div className="mx-auto max-w-5xl px-4 sm:px-12 py-4 text-black">
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-3">
                            <label className="font-bold">{t('common.filter')}</label>
                            <div className="relative inline-block">
                                <button
                                    className="bg-bs-card text-white px-3 py-2 rounded border border-bs-red font-bold text-xs"
                                    onClick={() => setShowOrderDropdown((v) => !v)}
                                >
                                    {(() => {
                                        switch (order) {
                                            case 'name-asc': return t('list.orderNameAsc');
                                            case 'name-desc': return t('list.orderNameDesc');
                                            case 'neighborhood-asc': return t('list.orderNeighborhoodAsc');
                                            case 'neighborhood-desc': return t('list.orderNeighborhoodDesc');
                                            default: return '';
                                        }
                                    })()}
                                </button>
                                {showOrderDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-bs-card border border-bs-red rounded shadow-lg z-10">
                                        {ORDER_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                className="block w-full text-left px-4 py-2 text-white hover:bg-bs-red"
                                                onClick={() => {
                                                    setOrder(opt.value);
                                                    setShowOrderDropdown(false);
                                                }}
                                            >
                                                {(() => {
                                                    switch (opt.value) {
                                                        case 'name-asc': return t('list.orderNameAsc');
                                                        case 'name-desc': return t('list.orderNameDesc');
                                                        case 'neighborhood-asc': return t('list.orderNeighborhoodAsc');
                                                        case 'neighborhood-desc': return t('list.orderNeighborhoodDesc');
                                                        default: return '';
                                                    }
                                                })()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Lista de lugares */}
            <section className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] flex-1 shadow-lg`}>
                <div className="mx-auto max-w-5xl px-0 sm:px-12">
                    <div className="rounded-t-lg overflow-hidden" key={`list-${selectedEnv || 'all'}`}>
                        <div className="flex bg-bs-card text-[#F5F5F5] font-bold text-lg sm:text-[20px] leading-tight border-b-2 border-bs-red">
                            <div className="w-1/3 px-6 sm:px-14 py-3">{t('list.nameHeader')}</div>
                            <div className={isOpensToday ? 'w-1/4 py-3 ps-4 sm:ps-6' : 'w-1/3 py-3 ps-4 sm:ps-6'}>{t('list.neighborhoodHeader')}</div>
                            {isOpensToday && (
                                <div className="w-1/6 py-3 ps-4 sm:ps-6">{t('placeList.opensAtHeader', { defaultValue: 'Abertura' })}</div>
                            )}
                        </div>
                        {sortedPlaces.length === 0 && <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>}
                        {sortedPlaces.map((place, idx) => {
                            console.log('[PlaceListPage LIST MAP] rendering place id:', place.id, 'name:', place.name, 'total in sortedPlaces:', sortedPlaces.length);
                            const rowBg = idx % 2 === 0 ? 'bg-[#403E44]' : 'bg-[#48464C]';
                            return (
                                <div
                                    key={`${place.id}-${selectedEnv || 'all'}`}
                                    className={`flex items-center ${rowBg} px-4 sm:px-12 border-b border-bs-bg text-sm sm:text-base text-[#F5F5F5]`}
                                >
                                    <div className="w-1/3 px-2 py-6">{place.name}</div>
                                    <div className={isOpensToday ? 'w-1/4 px-4 py-6' : 'w-1/3 px-4 py-6'}>{getPlaceNeighborhood(place) || ""}</div>
                                    {isOpensToday && (
                                        <div className="w-1/6 px-4 py-6 text-sm text-gray-200">
                                            {getOpeningDisplayForToday(place)}
                                        </div>
                                    )}
                                    <div className="flex-1 flex justify-end">
                                        <ActionButton
                                            onClick={() => {
                                                const typeToSlug: Record<string, string> = {
                                                    RESTAURANT: "restaurants",
                                                    BAR: "bars",
                                                    COFFEE: "coffees",
                                                    NIGHTLIFE: "nightlife",
                                                    NATURE: "nature",
                                                    TOURIST_SPOT: "tourist-spot",
                                                };
                                                // Use the actual place.type when available (fixes 'Abrem hoje' mixed lists)
                                                const placeTypeKey = place.type || mappedType;
                                                const slug = typeToSlug[placeTypeKey] || routeTypeLower;
                                                navigate(`/place/${slug}/${place.id}`);
                                            }}
                                            size="md"
                                            className="!px-1 sm:!px-4"
                                        >
                                            {(() => {
                                                const details = t('common.details');
                                                const mobile = details.replace(' ', '\n');
                                                return (
                                                    <>
                                                        <span className="sm:hidden whitespace-pre-line">{mobile}</span>
                                                        <span className="hidden sm:inline">{details}</span>
                                                    </>
                                                );
                                            })()}
                                        </ActionButton>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Modal de tipos de ambiente */}
            {showEnvironmentModal && (
                <EnvironmentSelectModal
                    environments={environments}
                    excludedValues={environments.slice(0, 8).map(e => e.value)}
                    selectedEnv={selectedEnv}
                    onClose={() => setShowEnvironmentModal(false)}
                    onSelect={(env) => {
                        const next = env?.value || null;
                        setSelectedEnv(next);
                    }}
                />
            )}
        </div>
    );
};
