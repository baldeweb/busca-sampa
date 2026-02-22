import React, { useState, useMemo, useRef, useEffect } from "react";
import { useDocumentTitle } from "@/web/hooks/useDocumentTitle";
import { Toolbar } from '@/web/components/layout/Toolbar';
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import { useOpeningPatterns } from "@/web/hooks/useOpeningPatterns";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { slugify } from '@/core/services/Slugify';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { EnvironmentSelectModal } from '@/web/components/place/EnvironmentSelectModal';
import flagSp from '@/assets/imgs/etc/logo-role-paulista.png';
import icBars from '@/assets/imgs/icons/ic_bars.png';
import icCoffee from '@/assets/imgs/icons/ic_coffee.png';
import icFree from '@/assets/imgs/icons/ic_free.png';
import icNightlife from '@/assets/imgs/icons/ic_nightlife.png';
import icNature from '@/assets/imgs/icons/ic_nature.png';
import icRestaurants from '@/assets/imgs/icons/ic_restaurants.png';
import icTouristSpot from '@/assets/imgs/icons/ic_tourist_spot.png';
import icForfun from '@/assets/imgs/icons/ic_forfun.png';
import icStores from '@/assets/imgs/icons/ic_stores.png';
import icMouth from '@/assets/imgs/icons/ic_mouth.png';
import icOpenToday from '@/assets/imgs/icons/ic_open_today.png';
import { PlaceListItem } from "@/web/components/place/PlaceListItem";
import EnvironmentGrid from "../components/ui/EnvironmentGrid";
import { FilterBar } from "@/web/components/ui/FilterBar";
import { ReportProblemFooter } from '@/web/components/layout/ReportProblemFooter';
import { getPlaceListTypes, getPrimaryPlaceType, placeHasType } from '@/core/domain/models/PlaceRecommendation';
import { useEnvironmentVisibleCount } from '@/web/hooks/useEnvironmentVisibleCount';

const ORDER_OPTIONS = [
    { value: "name-asc" },
    { value: "neighborhood-asc" },
];

export const PlaceListPage: React.FC = () => {
    const { t } = useTranslation();
    const { type: routeType } = useParams();
    const routeTypeRaw = routeType || "restaurants";
    const routeTypeLower = routeTypeRaw.toLowerCase();
    const navigate = useNavigate();
    const listLocation = useLocation();
    const allowedIdsFromState = (listLocation.state as any)?.ids as Array<string | number> | undefined;
    const allowedIdsSet = useMemo(() => new Set((allowedIdsFromState || []).map(v => String(v))), [allowedIdsFromState]);
    // Carrega todas as categorias
    const { data: restaurants } = useRecommendationList("restaurants");
    const { data: bars } = useRecommendationList("bars");
    const { data: coffees } = useRecommendationList("coffees");
    const { data: nightlife } = useRecommendationList("nightlife");
    const { data: nature } = useRecommendationList("nature");
    const { data: pleasures } = useRecommendationList("pleasure");
    const { data: touristSpots } = useRecommendationList("tourist-spot");
    const { data: forfun } = useRecommendationList("forfun");
    const { data: stores } = useRecommendationList("stores");
    const { data: openingPatternsData } = useOpeningPatterns();
    const openingPatterns = openingPatternsData || [];
    const visibleEnvironmentCount = useEnvironmentVisibleCount();

    // Junta todos os lugares em um único array para filtros especiais
    const allPlaces = useMemo(() => [
        ...restaurants,
        ...bars,
        ...coffees,
        ...nightlife,
        ...nature,
        ...pleasures,
        ...touristSpots,
        ...forfun,
        ...stores,
    ], [restaurants, bars, coffees, nightlife, nature, pleasures, touristSpots, forfun, stores]);

    // Mapeia slug para tipo utilizado nos dados
    const typeMap: Record<string, string> = {
        restaurants: "RESTAURANTS",
        restaurantes: "RESTAURANTS",
        bars: "BARS",
        bares: "BARS",
        coffees: "COFFEES",
        cafeterias: "COFFEES",
        nightlife: "NIGHTLIFE",
        "vida-noturna": "NIGHTLIFE",
        nature: "NATURE",
        natureza: "NATURE",
        "tourist-spot": "TOURIST_SPOT",
        "pontos-turisticos": "TOURIST_SPOT",
        "pleasure": "PLEASURE",
        prazer: "PLEASURE",
        free: "FREE",
        gratuito: "FREE",
        forfun: "FORFUN",
        diversao: "FORFUN",
        stores: "STORES",
        lojas: "STORES",
    };
    const mappedType = typeMap[routeTypeLower] || routeTypeLower.toUpperCase() || "RESTAURANT";

    // If someone navigates directly to /pleasure (via URL), force them to /nightlife.
    // Only allow /pleasure when location.state.fromLongPress === true.
    React.useEffect(() => {
        try {
            const allow = (listLocation.state as any)?.fromLongPress === true;
            if (routeTypeLower === 'pleasure' && !allow) {
                navigate('/nightlife', { replace: true });
            }
        } catch (_) { }
    }, [routeTypeLower, listLocation.state, navigate]);

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
            // places that have opening times for today AND are either open now
            // or have a future opening later today. Exclude places that only
            // had past openings earlier today but are currently closed.
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
            return allPlaces.filter(place => {
                // Oculta itens de Casa de Prazeres nesta listagem
                if (placeHasType(place, 'PLEASURE')) return false;
                const periods = getPeriodsForToday(place);
                if (!periods || periods.length === 0) return false;
                // if currently open by existing helper, include
                try { if (isOpenNow(periods)) return true; } catch (_) { }

                // otherwise check each period's open/close to see if any opening is later today
                for (const p of periods) {
                    if (!p.open) continue;
                    const openM = parseTime(p.open);
                    // if there's no close, treat as a single opening time (future if open > now)
                    const hasClose = Boolean(p.close);
                    let closeM = hasClose ? parseTime(p.close) : null;

                    // normalize overnight closes (close earlier than open => close is next day)
                    if (hasClose && closeM! <= openM) {
                        closeM = closeM! + 24 * 60;
                    }

                    // consider current minutes in 0..(24*60) and also current + 24h window for overnight checks
                    const nowCandidates = [currentMinutes, currentMinutes + 24 * 60];

                    // if any candidate falls within open..close range, it means currently open (should have been caught), skip
                    if (hasClose) {
                        for (const cand of nowCandidates) {
                            if (cand >= openM && cand < (closeM as number)) return true;
                        }
                    }

                    // if open is later today (openM > currentMinutes and openM < 24h), include
                    if (openM > currentMinutes && openM < 24 * 60) return true;
                }
                return false;
            });
        }
        return allPlaces.filter(p => placeHasType(p, mappedType));
    }, [allPlaces, mappedType, routeType, restaurants, openingPatterns]);

    // Intersect with IDs passed via navigation state, if any
    const baseList = useMemo(() => {
        if (!allowedIdsSet || allowedIdsSet.size === 0) return filteredByType;
        return filteredByType.filter(p => allowedIdsSet.has(String(p.id)));
    }, [filteredByType, allowedIdsSet]);

    // Chips de ambiente (tags únicos)
    const environments = useMemo(() => {
        const useFixedTypes = routeTypeLower === 'abrem-hoje' || mappedType === 'FREE';
        if (useFixedTypes) {
            const fixedTypes = [
                'RESTAURANTS',
                'BARS',
                'NIGHTLIFE',
                'COFFEES',
                'NATURE',
                'TOURIST_SPOT',
                'FORFUN',
                'STORES',
            ];
            return fixedTypes.map((value) => ({ label: getPlaceTypeLabel(value), value }));
        }
        const envSet = new Set<string>();
        baseList.forEach(p => {
            p.tags?.forEach((t: string) => envSet.add(t));
        });
        const tagArr = Array.from(envSet).map(e => ({ label: getEnvironmentLabel(e), value: e }));
        if (tagArr.length > 0) {
            tagArr.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
            return tagArr;
        }

        // Fallback: se não houver tags, use os tipos de lugar presentes (ex: TOURIST_SPOT, RESTAURANT)
        const typeSet = new Set<string>();
        baseList.forEach(p => {
            getPlaceListTypes(p).forEach((placeType) => typeSet.add(placeType));
        });
        const typeArr = Array.from(typeSet).map(e => ({ label: getPlaceTypeLabel(e), value: e }));
        typeArr.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
        return typeArr;
    }, [baseList, mappedType, routeTypeLower]);



    // Mapeia o tipo atual para o ícone usado no cabeçalho e no cartão 'Todos'
    const headerIcon = (() => {
        switch (mappedType) {
            case 'FREE': return icFree;
            case 'BARS': return icBars;
            case 'COFFEES': return icCoffee;
            case 'NIGHTLIFE': return icNightlife;
            case 'NATURE': return icNature;
            case 'RESTAURANTS': return icRestaurants;
            case 'TOURIST_SPOT': return icTouristSpot;
            case 'FORFUN': return icForfun;
            case 'STORES': return icStores;
            case 'PLEASURE': return icMouth;
            case 'ABREM-HOJE':
            case 'ABREM_HOJE':
            case 'OPEN_TODAY':
                return icOpenToday;
            default: return flagSp;
        }
    })();

    const getPlaceIconSrc = (type?: string) => {
        switch (type) {
            case 'FREE': return icFree;
            case 'BARS': return icBars;
            case 'COFFEES': return icCoffee;
            case 'NIGHTLIFE': return icNightlife;
            case 'NATURE': return icNature;
            case 'RESTAURANTS': return icRestaurants;
            case 'TOURIST_SPOT': return icTouristSpot;
            case 'FORFUN': return icForfun;
            case 'STORES': return icStores;
            case 'PLEASURE': return icMouth;
            default: return flagSp;
        }
    };

    // Long-press support: when viewing NIGHTLIFE, pressing the header icon for 3s
    // will navigate to the 'pleasure' listing. We attach handlers to the image.
    const longPressTimer = useRef<number | null>(null);
    useEffect(() => {
        return () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }
        };
    }, []);

    function startHeaderLongPress() {
        if (mappedType !== 'NIGHTLIFE') return;
        if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
        // 2000ms = 2 seconds
        longPressTimer.current = window.setTimeout(() => {
            longPressTimer.current = null;
            navigate('/pleasure', { state: { fromLongPress: true } });
        }, 2000) as unknown as number;
    }

    function cancelHeaderLongPress() {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }

    const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
    const [order, setOrder] = useState(ORDER_OPTIONS[0].value);
    const [orderVersion, setOrderVersion] = useState(0);

    const [showSortingMenu, setShowSortingMenu] = useState(false);
    const [showHoursMenu, setShowHoursMenu] = useState(false);
    const [showScheduleMenu, setShowScheduleMenu] = useState(false);
    const [showCityMenu, setShowCityMenu] = useState(false);
    const [showPriceMenu, setShowPriceMenu] = useState(false);
    const [filterOpenNow, setFilterOpenNow] = useState(false);
    const [scheduleFilter, setScheduleFilter] = useState<'any' | 'required' | 'not-required'>('any');
    const [cityFilter, setCityFilter] = useState<string | null>(null);
    const [priceFilter, setPriceFilter] = useState<string | null>(null);
    const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);

    // Cities available for current base list
    const cities = useMemo(() => {
        const s = new Set<string>();
        baseList.forEach(p => {
            (p.addresses || []).forEach((a: any) => { if (a && a.city) s.add(String(a.city)); });
        });
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [baseList]);

    // Price options available for current base list
    const priceOptions = useMemo(() => {
        const s = new Set<string>();
        baseList.forEach(p => { if (p.priceRange) s.add(String(p.priceRange)); });
        const arr = Array.from(s);
        const ORDER: string[] = ["FREE", "ECONOMIC", "MODERATE", "EXPENSIVE"]; // requested sequence (FREE first)
        return arr.sort((a, b) => {
            const ia = ORDER.indexOf(a);
            const ib = ORDER.indexOf(b);
            if (ia !== -1 || ib !== -1) {
                if (ia === -1 && ib === -1) return a.localeCompare(b);
                if (ia === -1) return 1;
                if (ib === -1) return -1;
                return ia - ib;
            }
            return a.localeCompare(b);
        });
    }, [baseList]);

    // Combined filters: environment, schedule and city
    const filteredPlaces = useMemo(() => {
        const normalize = (s: any) => String(s || '').trim().toLowerCase();
        const sel = selectedEnv ? normalize(selectedEnv) : null;
        return baseList.filter(p => {
            // environment/type filter
            if (sel) {
                if (placeHasType(p, sel)) {
                    // ok
                } else if (Array.isArray(p.tags) && p.tags.some((tg: any) => normalize(tg) === sel)) {
                    // ok
                } else return false;
            }

            // schedule filter
            if (scheduleFilter === 'required' && !p.shouldSchedule) return false;
            if (scheduleFilter === 'not-required' && p.shouldSchedule) return false;

            // city filter
            if (cityFilter) {
                const hasCity = (p.addresses || []).some((a: any) => String(a.city || '').toLowerCase() === cityFilter.toLowerCase());
                if (!hasCity) return false;
            }

            // price filter
            if (priceFilter && String(p.priceRange || '').toLowerCase() !== String(priceFilter || '').toLowerCase()) return false;

            return true;
        });
    }, [baseList, selectedEnv, scheduleFilter, cityFilter, priceFilter]);

    // Apply 'open now' filter if requested
    const filteredPlacesWithOpenNow = useMemo(() => {
        if (!filterOpenNow) return filteredPlaces;
        return filteredPlaces.filter(p => {
            try {
                const periods = getPeriodsForToday(p);
                return isOpenNow(periods);
            } catch (_) { return false; }
        });
    }, [filteredPlaces, filterOpenNow]);

    // Debug: log selected environment and result counts to aid troubleshooting
    React.useEffect(() => {
        if (!selectedEnv) return;
        try {
            console.log(`[PlaceListPage] selectedEnv=${selectedEnv} baseList=${baseList.length} result=${filteredPlaces.length} sampleIds=${filteredPlaces.slice(0, 5).map(p => p.id).join(',')}`);
        } catch (_) { }
    }, [selectedEnv, baseList, filteredPlaces]);

    // Debug: print available environments (label/value) to verify what the UI shows
    React.useEffect(() => {
        try {
            console.log('[PlaceListPage] environments=', environments.map(e => ({ label: e.label, value: e.value })));
            const sample = baseList.slice(0, 5);
            console.log('[PlaceListPage] filteredByType sample (5):', sample.map(p => ({ id: p.id, name: p.name, listTypes: p.listTypes, tags: p.tags })));
        } catch (_) { }
    }, [environments, baseList]);

    // Debug: test filter matching when selectedEnv changes
    React.useEffect(() => {
        if (!selectedEnv) return;
        try {
            const normalize = (s: any) => String(s || '').trim().toLowerCase();
            const sel = normalize(selectedEnv);
            const matches = baseList.filter(p => {
                if (placeHasType(p, sel)) return true;
                if (Array.isArray(p.tags)) {
                    for (const tg of p.tags) if (normalize(tg) === sel) return true;
                }
                return false;
            });
            console.log(`[PlaceListPage] selectedEnv="${selectedEnv}" normalized="${sel}" matches=${matches.length} samples=[${matches.slice(0, 3).map(p => `${p.id}:${p.name}`).join(', ')}]`);
        } catch (e) { console.error('Debug filter error:', e); }
    }, [selectedEnv, baseList]);

    // Ordenação
    const sortedPlaces = useMemo(() => {
        const arr = [...filteredPlacesWithOpenNow];
        switch (order) {
            case "name-asc":
                arr.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "neighborhood-asc":
                arr.sort((a, b) => {
                    const na = a.addresses?.[0]?.neighborhood || "";
                    const nb = b.addresses?.[0]?.neighborhood || "";
                    return na.localeCompare(nb);
                });
                break;
        }
        return arr;
    }, [filteredPlacesWithOpenNow, order, orderVersion]);


    // Título dinâmico: sempre traduzido conforme o idioma ativo.
    const placeTypeForTitle = mappedType;
    const isOpensTodayRoute = routeTypeLower === 'abrem-hoje' || placeTypeForTitle === 'OPEN_TODAY';
    const title = isOpensTodayRoute
        ? t('whereIsToday.opensToday', { defaultValue: 'Abrem hoje' })
        : getPlaceTypeLabel(placeTypeForTitle);
    useDocumentTitle(title);

    // Subtítulo dinâmico usando chaves de tradução e textos por tipo
    const article = t(`placeList.article.${placeTypeForTitle}`, { defaultValue: '' });
    const nounTranslated = t(`placeList.noun.${placeTypeForTitle}`, { defaultValue: title.toLowerCase() });
    const subtitle = t('placeList.subtitleTemplate', { article, noun: nounTranslated });

    // DEBUG LOGS (diagnóstico)
    React.useEffect(() => {
        console.log("routeType param:", routeType);
        console.log("mappedType:", mappedType);
        console.log("baseList length:", baseList.length);
    }, [routeType, mappedType, baseList]);

    // removed unused variable isOpensToday

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
        const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
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
        if (!periods || periods.length === 0) {
            // If there are no periods for today, scan the next 7 days and return the first upcoming opening.
            // If it's tomorrow show "Abre amanhã às XXX", otherwise show weekday + time.
            try {
                const now = new Date();
                for (let offset = 1; offset <= 7; offset++) {
                    const futurePeriods = getPeriodsForDay(place, offset);
                    if (!futurePeriods || futurePeriods.length === 0) continue;

                    let earliest: string | null = null;
                    function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
                    for (const p of futurePeriods) {
                        if (!p.open) continue;
                        if (earliest === null || parseTime(p.open) < parseTime(earliest)) earliest = p.open;
                    }
                    if (earliest) {
                        if (offset === 1) return t('placeList.opensTomorrowAt', { time: earliest, defaultValue: `Abre amanhã às ${earliest}` });
                        const weekdaysPt = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
                        const weekday = weekdaysPt[(now.getDay() + offset) % 7];
                        return t('placeList.opensOnAt', { day: weekday, time: earliest, defaultValue: `Abre ${weekday} às ${earliest}` });
                    }
                }
            } catch (e) {
                console.warn('[getOpeningDisplayForToday] future scan failed for place id=', place?.id, e);
            }
            return '-';
        }

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

        // No more openings today — attempt a robust next-opening search across the next 7 days.
        // If the next opening is tomorrow, return the localized "Abre amanhã às XXX".
        try {
            for (let offset = 1; offset <= 7; offset++) {
                const futurePeriods = getPeriodsForDay(place, offset);
                if (!futurePeriods || futurePeriods.length === 0) continue;

                // find earliest opening in that future day
                let earliest: string | null = null;
                function parseTime(str: string) { const [h, m] = (str || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
                for (const p of futurePeriods) {
                    if (!p.open) continue;
                    if (earliest === null || parseTime(p.open) < parseTime(earliest)) earliest = p.open;
                }
                if (earliest) {
                    if (offset === 1) return t('placeList.opensTomorrowAt', { time: earliest, defaultValue: `Abre amanhã às ${earliest}` });
                    // if not tomorrow, show weekday + time (e.g. "Abre sexta-feira às 18:00")
                    const weekdaysPt = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
                    const weekday = weekdaysPt[(now.getDay() + offset) % 7];
                    return t('placeList.opensOnAt', { day: weekday, time: earliest, defaultValue: `Abre ${weekday} às ${earliest}` });
                }
            }
        } catch (e) {
            // on error, fallthrough to '-'
            console.warn('[getOpeningDisplayForToday] next-opening search failed for place id=', place?.id, e);
        }

        return '-';
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
            console.warn(`PlaceListPage: no neighborhood for place id=${place?.id}`, place?.addresses?.slice?.(0, 3) || place?.addresses);
        } catch (_) { }
        return undefined;
    }

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            {/* Top Bar */}
            <Toolbar onBack={() => navigate(-1)} />
            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
                <div className="mx-auto max-w-5xl px-0 sm:px-12 pt-0 pb-6 sm:pb-8 text-black">
                    {/* Título e descrição */}
                    <div className="w-full bg-[#F5F5F5] border border-[#8492A6] rounded-b-[8px] px-4 pt-6 pb-4">
                        <div className="flex items-start gap-4">
                            <img
                                src={headerIcon}
                                alt="flag"
                                className="w-12 h-12 object-contain"
                                draggable={false}
                                onDragStart={(ev) => ev.preventDefault()}
                                onContextMenu={(ev) => ev.preventDefault()}
                                style={{ WebkitTouchCallout: 'none', WebkitUserDrag: 'none', userSelect: 'none' } as any}
                                onMouseDown={startHeaderLongPress}
                                onTouchStart={startHeaderLongPress}
                                onMouseUp={cancelHeaderLongPress}
                                onMouseLeave={cancelHeaderLongPress}
                                onTouchEnd={cancelHeaderLongPress}
                                onTouchCancel={cancelHeaderLongPress}
                            />
                            <div>
                                <SectionHeading title={title} underline={false} sizeClass="text-lg sm:text-2xl text-[#212121]" />
                                <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{subtitle}</p>
                            </div>
                        </div>
                    </div>
                    {/* Grid de tipos de ambiente */}
                    {environments.length > 0 && (
                        <EnvironmentGrid
                            environments={environments}
                            selectedEnv={selectedEnv}
                            onSelect={(value) => setSelectedEnv(value)}
                            onViewMore={() => setShowEnvironmentModal(true)}
                            title={((routeType || '').toLowerCase() === 'abrem-hoje' || mappedType === 'FREE') ? t('placeList.environmentTitlePlace', { defaultValue: 'Tipo de lugar:' }) : undefined}
                        />
                    )}
                </div>
            </section>
            <FilterBar
                orderOptions={ORDER_OPTIONS}
                order={order}
                onOrderSelect={(value) => {
                    setOrder(value);
                    setOrderVersion((x) => x + 1);
                    setFilterOpenNow(false);
                }}
                filterOpenNow={filterOpenNow}
                onSelectOpenNow={() => {
                    setFilterOpenNow(true);
                    setOrder('');
                    setOrderVersion((x) => x + 1);
                }}
                onSelectAnyHour={() => {
                    setFilterOpenNow(false);
                    setOrderVersion((x) => x + 1);
                }}
                scheduleFilter={scheduleFilter}
                onSelectSchedule={(value) => setScheduleFilter(value)}
                cities={cities}
                selectedCity={cityFilter}
                onSelectCity={(value) => setCityFilter(value)}
                priceOptions={priceOptions}
                priceFilter={priceFilter}
                onSelectPrice={(value) => setPriceFilter(value)}
                showSortingMenu={showSortingMenu}
                setShowSortingMenu={setShowSortingMenu}
                showHoursMenu={showHoursMenu}
                setShowHoursMenu={setShowHoursMenu}
                showScheduleMenu={showScheduleMenu}
                setShowScheduleMenu={setShowScheduleMenu}
                showCityMenu={showCityMenu}
                setShowCityMenu={setShowCityMenu}
                showPriceMenu={showPriceMenu}
                setShowPriceMenu={setShowPriceMenu}
                openNowLabelKey="filters.openNowLabel"
                anyHourLabelKey="filters.anyHourLabel"
                anyHourLabelDefault="Qualquer horário"
                showCityFilter={cities.length > 1}
                showPriceFilter={priceOptions.length > 1}
            />
            {/* Modal antigo de filtros removido em favor dos menus inline */}
            {/* Lista de lugares */}
            <section className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#212121] shadow-lg pb-24`}>
                <div className="mx-auto max-w-5xl px-4 sm:px-12">
                    <div className="rounded-t-lg overflow-hidden" key={`list-${selectedEnv || 'all'}-${order}-${orderVersion}`}>
                        {sortedPlaces.length === 0 && <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>}
                        {sortedPlaces.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                                {sortedPlaces.map((place) => {
                                    const neighborhood = getPlaceNeighborhood(place) || ((!place.addresses || place.addresses.length === 0) ? t('list.variablePlace') : "");
                                    const openingText = (place.openingHours.patternId === 'CHECK_AVAILABILITY_DAYTIME')
                                        ? t('openingHours.checkAvailabilityLabel')
                                        : getOpeningDisplayForToday(place);
                                    return (
                                        <PlaceListItem
                                            key={`${place.id}-${selectedEnv || 'all'}`}
                                            name={place.name}
                                            neighborhood={neighborhood}
                                            openingText={openingText}
                                            iconSrc={getPlaceIconSrc(getPrimaryPlaceType(place))}
                                            detailsLabel={t('common.details')}
                                            onDetails={() => {
                                                const typeToSlug: Record<string, string> = {
                                                    RESTAURANTS: "restaurantes",
                                                    BARS: "bares",
                                                    COFFEES: "cafeterias",
                                                    NIGHTLIFE: "vida-noturna",
                                                    NATURE: "natureza",
                                                    TOURIST_SPOT: "pontos-turisticos",
                                                    FORFUN: "diversao",
                                                    STORES: "lojas",
                                                    PLEASURE: "prazer",
                                                    FREE: "gratuito",
                                                };
                                                const placeTypeKey = getPrimaryPlaceType(place) || mappedType;
                                                const slug = typeToSlug[placeTypeKey] || routeTypeLower;
                                                navigate(`/${slug}/${slugify(place.name)}`);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal de tipos de ambiente */}
            {showEnvironmentModal && (
                <EnvironmentSelectModal
                    environments={environments}
                    excludedValues={environments.slice(0, visibleEnvironmentCount).map((e) => e.value)}
                    selectedEnv={selectedEnv}
                    onClose={() => setShowEnvironmentModal(false)}
                    onSelect={(env) => {
                        const next = env?.value || null;
                        setSelectedEnv(next);
                    }}
                />
            )}

            <ReportProblemFooter subject={`Reportar um problema da página de lista de lugares ${title}`} />
        </div>
    );
};
