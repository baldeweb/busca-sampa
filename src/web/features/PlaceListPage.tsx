import React, { useState, useMemo } from "react";
import { useDocumentTitle } from "@/web/hooks/useDocumentTitle";
import { FaArrowLeft } from "react-icons/fa";
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { useOpeningPatterns } from "@/web/hooks/useOpeningPatterns";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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
            return allPlaces.filter(place => {
                const pattern = openingPatterns.find((pat: any) => pat.id === place.openingHours?.patternId);
                if (!pattern) return false;
                return isOpenNow(pattern.periods);
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

    // Título dinâmico
    const placeTypeForTitle = (routeType?.toUpperCase() || "RESTAURANT");
    const title = t(`placeType.${placeTypeForTitle}`);
    useDocumentTitle(title);

    // DEBUG LOGS (diagnóstico)
    React.useEffect(() => {
        console.log("routeType param:", routeType);
        console.log("mappedType:", mappedType);
        console.log("filteredByType length:", filteredByType.length);
    }, [routeType, mappedType, filteredByType]);
    
    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            {/* Top Bar */}
            <div className="bg-black border-b-2 border-bs-red">
                <div className="mx-auto max-w-5xl flex items-center px-4 pt-12 pb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white text-lg font-bold flex items-center"
                    >
                        <FaArrowLeft className="mr-2" /> {t('common.back')}
                    </button>
                </div>
            </div>
            {/* Título e descrição */}
            <div className="px-4 py-6 bg-[#F5F5F5] text-black">
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
            </div>
            {/* Chips de ambiente */}
            {environments.length > 0 && (
                <div className="px-4 flex gap-2 flex-wrap bg-[#F5F5F5] text-black pb-4">
                    {/* Chip reset de ambiente */}
                    <button
                        className={`px-3 py-2 rounded border font-bold text-xs ${selectedEnv === null
                            ? "bg-bs-red text-white border-bs-red"
                            : "bg-bs-card text-white border-bs-red"
                            }`}
                        onClick={() => setSelectedEnv(null)}
                    >
                        {t('common.all')}
                    </button>
                    {environments.map((env) => (
                        <button
                            key={env.value}
                            className={`px-3 py-2 rounded border font-bold text-xs ${selectedEnv === env.value
                                    ? "bg-bs-red text-white border-bs-red"
                                    : "bg-bs-card text-white border-bs-red"
                                }`}
                            onClick={() => setSelectedEnv(selectedEnv === env.value ? null : env.value)}
                        >
                            {env.label}
                        </button>
                    ))}
                    {/* Botão 'Ver mais' removido; 'Tudo' já reseta filtro */}
                </div>
            )}
            {/* Filtro de ordenação */}
            <div className="px-4 bg-[#F5F5F5] text-black pb-4">
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
                        <div className="absolute left-0 mt-2 w-64 bg-bs-card border border-bs-red rounded shadow-lg z-10">
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
            {/* Lista de lugares */}
            <div className="px-0 flex-1 bg-[#48464C]">
                <div className="rounded-t-lg overflow-hidden">
                    <div className="flex bg-bs-card text-[#F5F5F5] font-bold text-[24px] leading-tight border-b-2 border-bs-red">
                        <div className="w-1/3 px-4 py-3">{t('list.nameHeader')}</div>
                        <div className="w-1/3 px-4 py-3">{t('list.neighborhoodHeader')}</div>
                    </div>
                    {sortedPlaces.length === 0 && <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>}
                    {sortedPlaces.map((place, idx) => {
                        const rowBg = idx % 2 === 0 ? 'bg-[#403E44]' : 'bg-[#48464C]';
                        return (
                        <div
                            key={place.id}
                            className={`flex items-center ${rowBg} border-b border-bs-bg text-base text-[#F5F5F5]`}
                        >
                            <div className="w-1/3 px-4 py-6">{place.name}</div>
                            <div className="w-1/3 px-4 py-6">{place.addresses?.[0]?.neighborhood || ""}</div>
                            <div className="flex-1 flex justify-end pr-4">
                                <button
                                    className="bg-bs-red text-white text-xs font-bold px-3 py-2 rounded"
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
                                >
                                    {t('common.details')}
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
