import React, { useState, useMemo } from "react";
import { useDocumentTitle } from "@/web/hooks/useDocumentTitle";
import { BackHeader } from '@/web/components/layout/BackHeader';
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { useOpeningPatterns } from "@/web/hooks/useOpeningPatterns";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ActionButton } from '@/web/components/ui/ActionButton';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { CategoryCard } from '@/web/components/ui/CategoryCard';
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
    const { data: openingPatterns } = useOpeningPatterns();
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

    // Chips de ambiente (foodStyle + tags únicos)
    const environments = useMemo(() => {
        const envSet = new Set<string>();
        filteredByType.forEach(p => {
            p.tags?.forEach((t: string) => envSet.add(t));
            p.foodStyle?.forEach((f: string) => envSet.add(f));
        });
        return Array.from(envSet).map(e => ({ label: getEnvironmentLabel(e), value: e }));
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

    // Filtro de ambiente
    const filteredPlaces = useMemo(() => {
        if (!selectedEnv) return filteredByType;
        return filteredByType.filter(p =>
            p.tags?.includes(selectedEnv) ||
            p.foodStyle?.includes(selectedEnv) ||
            p.tags?.includes(selectedEnv)
        );
    }, [filteredByType, selectedEnv]);

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

    // Helper: get raw periods for today (merged pattern + overrides)
    function getPeriodsForToday(place: any): any[] {
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
        return periods.filter((p: any) => p.open && (p.days?.includes(currentDay) || p.days?.includes('EVERYDAY')));
    }

    // Helper: compute display value for the opening column per user's request
    function getOpeningDisplayForToday(place: any): string {
        const periods = getPeriodsForToday(place);
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

        return '-';
    }

    // Helper: pick a neighborhood string for a place (prefer main unity)
    function getPlaceNeighborhood(place: any): string | undefined {
        const addrs = place?.addresses;
        if (!addrs || !Array.isArray(addrs) || addrs.length === 0) return undefined;
        const main = addrs.find((a: any) => a.isMainUnity);
        if (main) {
            if (main.neighborhood) return main.neighborhood;
            // try alternate keys (defensive for different data sources)
            for (const key of Object.keys(main)) {
                if (/neighbou?rhood/i.test(key) && main[key]) return main[key];
            }
            if (main.city) return main.city;
        }
        // fallback to first non-empty neighborhood or city
        for (const a of addrs) {
            if (!a) continue;
            if (a.neighborhood) return a.neighborhood;
            for (const key of Object.keys(a)) {
                if (/neighbou?rhood/i.test(key) && a[key]) return a[key];
            }
            if (a.city) return a.city;
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
                    {/* Chips de ambiente */}
                    {environments.length > 1 && (
                        <div className="bg-[#F5F5F5] text-black pb-4">
                            <h3 className="font-bold text-lg mb-3 pt-8">{t('placeList.environmentTitle') || 'Tipo de ambiente:'}</h3>
                            <div className="relative">
                                <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory w-full justify-start">
                                    {/* Mostrar opção 'Todos' somente quando houver mais de 1 ambiente */}
                                    {environments.length > 1 && (
                                        <CategoryCard
                                            key="all-environments"
                                            label={t('common.all')}
                                            icon={<img src={headerIcon} alt="all" className="w-8 h-8" />}
                                            selected={false}
                                            lightSelected={true}
                                            onClick={() => setSelectedEnv(null)}
                                            index={0}
                                        />
                                    )}
                                    {environments.map((env, idx) => {
                                        const key = (env.value || '').toString().replace(/-/g, '_').toUpperCase();
                                        let iconSrc = flagSp;
                                        if (key === 'FREE') iconSrc = icFree;
                                        else if (key === 'BAR' || key === 'BARS') iconSrc = icBars;
                                        else if (key === 'COFFEE' || key === 'COFFEES') iconSrc = icCoffee;
                                        else if (key === 'NIGHTLIFE') iconSrc = icNightlife;
                                        else if (key === 'NATURE') iconSrc = icNature;
                                        else if (key === 'RESTAURANT' || key === 'RESTAURANTS') iconSrc = icRestaurants;
                                        else if (key === 'TOURIST_SPOT' || key === 'TOURIST_SPOTS') iconSrc = icTouristSpot;

                                        return (
                                            <CategoryCard
                                                key={env.value}
                                                label={env.label}
                                                icon={<img src={iconSrc} alt={env.label} className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />}
                                                selected={selectedEnv === env.value}
                                                lightSelected={true}
                                                onClick={() => setSelectedEnv(selectedEnv === env.value ? null : env.value)}
                                                index={environments.length > 1 ? idx + 1 : idx}
                                            />
                                        );
                                    })}
                                </div>
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
            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] flex-1">
                <div className="mx-auto max-w-5xl px-0 sm:px-12">
                    <div className="rounded-t-lg overflow-hidden">
                        <div className="flex bg-bs-card text-[#F5F5F5] font-bold text-lg sm:text-[20px] leading-tight border-b-2 border-bs-red">
                            <div className="w-1/3 px-6 sm:px-14 py-3">{t('list.nameHeader')}</div>
                            <div className={isOpensToday ? 'w-1/4 py-3 ps-4 sm:ps-6' : 'w-1/3 py-3 ps-4 sm:ps-6'}>{t('list.neighborhoodHeader')}</div>
                            {isOpensToday && (
                                <div className="w-1/6 py-3 ps-4 sm:ps-6">{t('placeList.opensAtHeader', { defaultValue: 'Abertura' })}</div>
                            )}
                        </div>
                        {sortedPlaces.length === 0 && <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>}
                        {sortedPlaces.map((place, idx) => {
                            const rowBg = idx % 2 === 0 ? 'bg-[#403E44]' : 'bg-[#48464C]';
                            return (
                                <div
                                    key={place.id}
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
                                                const slug = typeToSlug[mappedType] || routeTypeLower;
                                                navigate(`/place/${slug}/${place.id}`);
                                            }}
                                            size="md"
                                        >
                                            {t('common.details')}
                                        </ActionButton>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};
