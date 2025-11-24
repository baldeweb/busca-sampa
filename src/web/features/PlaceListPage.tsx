import React, { useState, useMemo } from "react";
import { useDocumentTitle } from "@/web/hooks/useDocumentTitle";
import { FaArrowLeft } from "react-icons/fa";
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { useOpeningPatterns } from "@/web/hooks/useOpeningPatterns";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ActionButton } from '@/web/components/ui/ActionButton';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { CategoryCard } from '@/web/components/ui/CategoryCard';
import flagSp from '@/assets/imgs/flags/flag_sp.png';

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
        if ((routeType || "").toLowerCase() === "aberto-agora") {
            const patterns = openingPatterns || [];
            function getPeriodsForPlace(place: any) {
                const periods: any[] = [];
                const patternId = place.openingHours?.patternId;
                if (patternId) {
                    const pat = patterns.find((p: any) => p.id === patternId);
                    if (pat?.periods) periods.push(...pat.periods);
                }
                // customOverrides may contain period-like entries
                if (place.openingHours?.customOverrides && Array.isArray(place.openingHours.customOverrides)) {
                    periods.push(...place.openingHours.customOverrides);
                }
                return periods;
            }

            return allPlaces.filter(place => {
                const periods = getPeriodsForPlace(place);
                if (!periods || periods.length === 0) return false;
                return isOpenNow(periods);
            });
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

    // Título dinâmico: use o tipo mapeado (RESTAURANT, BAR, ...) para buscar a chave de tradução
    const placeTypeForTitle = mappedType;
    const title = (routeType || "").toLowerCase() === "aberto-agora"
        ? t('placeDetail.openNow')
        : t(`placeType.${placeTypeForTitle}`);
    useDocumentTitle(title);

    // Subtítulo dinâmico usando chaves de tradução e textos por tipo
    const article = t(`placeList.article.${placeTypeForTitle}`, { defaultValue: '' });
    const nounTranslated = t(`placeList.noun.${placeTypeForTitle}`, { defaultValue: title.toLowerCase() });
    const subtitle = t('placeList.subtitleTemplate', { article, noun: nounTranslated });

    // DEBUG LOGS (diagnóstico)
    React.useEffect(() => {
        console.log("routeType param:", routeType);
        console.log("mappedType:", mappedType);
        console.log("filteredByType length:", filteredByType.length);
    }, [routeType, mappedType, filteredByType]);

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            {/* Top Bar */}
            <div className="bg-black border-b-2 border-bs-red px-0 sm:px-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-0 flex items-center pt-8 sm:pt-12 pb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white text-lg font-bold flex items-center"
                    >
                        <FaArrowLeft className="mr-2" /> {t('common.back')}
                    </button>
                </div>
                <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-16 py-6 sm:py-8 text-black">
                        {/* Título e descrição */}
                        <div>
                            <div className="flex items-start gap-4">
                                <img src={flagSp} alt="flag" className="w-12 h-12 object-contain" />
                                <div>
                                    <SectionHeading title={title} underline={false} sizeClass="text-lg sm:text-2xl text-black" />
                                    <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{subtitle}</p>
                                </div>
                            </div>
                        </div>
                        {/* Chips de ambiente */}
                        {environments.length > 0 && (
                            <div className="bg-[#F5F5F5] text-black pb-4">
                                <h3 className="font-bold text-lg mb-3 pt-8">{t('placeList.environmentTitle') || 'Tipo de ambiente:'}</h3>
                                <div className="relative">
                                    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory w-full justify-start">
                                        {/* Mostrar opção 'Todos' somente quando houver mais de 1 ambiente */}
                                        {environments.length > 1 && (
                                            <CategoryCard
                                                key="all-environments"
                                                label={t('common.all')}
                                                icon={<img src={flagSp} alt="all" className="w-8 h-8" />}
                                                selected={false}
                                                onClick={() => setSelectedEnv(null)}
                                                index={0}
                                            />
                                        )}
                                        {environments.map((env, idx) => (
                                            <CategoryCard
                                                key={env.value}
                                                label={env.label}
                                                icon={<img src={flagSp} alt="cat" className="w-8 h-8" />}
                                                selected={selectedEnv === env.value}
                                                onClick={() => setSelectedEnv(selectedEnv === env.value ? null : env.value)}
                                                index={environments.length > 1 ? idx + 1 : idx}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
                {/* Filtro de ordenação */}
                <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-16 py-4 text-black">
                        <label className="font-bold mr-2">{t('common.filter')}</label>
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
            {/* Lista de lugares */}
            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] flex-1">
                <div className="mx-auto max-w-7xl px-0 sm:px-16">
                    <div className="rounded-t-lg overflow-hidden">
                        <div className="flex bg-bs-card text-[#F5F5F5] font-bold text-lg sm:text-[20px] leading-tight border-b-2 border-bs-red">
                            <div className="w-1/3 px-6 sm:px-6 py-3">{t('list.nameHeader')}</div>
                            <div className="w-1/3 py-3 ps-4 sm:ps-6">{t('list.neighborhoodHeader')}</div>
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
                                    <div className="w-1/3 px-4 py-6">{place.addresses?.[0]?.neighborhood || ""}</div>
                                    <div className="flex-1 flex justify-end pr-4">
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
                                            size="xs"
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
