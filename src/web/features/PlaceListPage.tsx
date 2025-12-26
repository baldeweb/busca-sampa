import React, { useState, useMemo, useRef, useEffect } from "react";
import { useDocumentTitle } from "@/web/hooks/useDocumentTitle";
import { BackHeader } from '@/web/components/layout/BackHeader';
import { getEnvironmentLabel } from "@/core/domain/enums/environmentLabel";
import { getPlaceTypeLabel } from "@/core/domain/enums/placeTypeLabel";
import { useOpeningPatterns } from "@/web/hooks/useOpeningPatterns";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { slugify } from '@/core/services/Slugify';
import { ActionButton } from '@/web/components/ui/ActionButton';
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
import icMouth from '@/assets/imgs/icons/ic_mouth.png';
import icOpenToday from '@/assets/imgs/icons/ic_open_today.png';
import icFilter from '@/assets/imgs/icons/ic_filter.png';
import icArrowDown from '@/assets/imgs/icons/ic_arrow_down.png';
import { getPriceRangeLabel } from "@/core/domain/enums/priceRangeLabel";

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
    const { data: openingPatternsData } = useOpeningPatterns();
    const openingPatterns = openingPatternsData || [];

    // Junta todos os lugares em um único array para filtros especiais
    const allPlaces = useMemo(() => [
        ...restaurants,
        ...bars,
        ...coffees,
        ...nightlife,
        ...nature,
        ...pleasures,
        ...touristSpots,
    ], [restaurants, bars, coffees, nightlife, nature, pleasures, touristSpots]);

    // Mapeia slug para tipo utilizado nos dados
    const typeMap: Record<string, string> = {
        restaurants: "RESTAURANTS",
        bars: "BARS",
        coffees: "COFFEES",
        nightlife: "NIGHTLIFE",
        nature: "NATURE",
        "tourist-spot": "TOURIST_SPOT",
        "pleasure": "PLEASURE",
        free: "FREE",
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
        } catch (_) {}
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
                if ((place.type || '').toUpperCase() === 'PLEASURE') return false;
                const periods = getPeriodsForToday(place);
                if (!periods || periods.length === 0) return false;
                // if currently open by existing helper, include
                try { if (isOpenNow(periods)) return true; } catch (_) {}

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
        return allPlaces.filter(p => p.type === mappedType);
    }, [allPlaces, mappedType, routeType, restaurants, openingPatterns]);

    // Intersect with IDs passed via navigation state, if any
    const baseList = useMemo(() => {
        if (!allowedIdsSet || allowedIdsSet.size === 0) return filteredByType;
        return filteredByType.filter(p => allowedIdsSet.has(String(p.id)));
    }, [filteredByType, allowedIdsSet]);

    // Chips de ambiente (tags únicos)
    const environments = useMemo(() => {
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
        baseList.forEach(p => { if (p.type) typeSet.add(p.type); });
        const typeArr = Array.from(typeSet).map(e => ({ label: getPlaceTypeLabel(e), value: e }));
        typeArr.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
        return typeArr;
    }, [baseList]);

    

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
            case 'PLEASURE': return icMouth;
            case 'ABREM-HOJE':
            case 'ABREM_HOJE':
            case 'OPEN_TODAY':
                return icOpenToday;
            default: return flagSp;
        }
    })();

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
    const [scheduleFilter, setScheduleFilter] = useState<'any'|'required'|'not-required'>('any');
    const [cityFilter, setCityFilter] = useState<string | null>(null);
    const [priceFilter, setPriceFilter] = useState<string | null>(null);
    const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);

    // Cities available for current base list
    const cities = useMemo(() => {
        const s = new Set<string>();
        baseList.forEach(p => {
            (p.addresses || []).forEach((a: any) => { if (a && a.city) s.add(String(a.city)); });
        });
        return Array.from(s).sort((a,b)=>a.localeCompare(b));
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
                if (normalize(p.type) === sel) {
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
            console.log(`[PlaceListPage] selectedEnv=${selectedEnv} baseList=${baseList.length} result=${filteredPlaces.length} sampleIds=${filteredPlaces.slice(0,5).map(p=>p.id).join(',')}`);
        } catch (_) {}
    }, [selectedEnv, baseList, filteredPlaces]);

    // Debug: print available environments (label/value) to verify what the UI shows
    React.useEffect(() => {
        try {
            console.log('[PlaceListPage] environments=', environments.map(e => ({ label: e.label, value: e.value })));
            const sample = baseList.slice(0, 5);
            console.log('[PlaceListPage] filteredByType sample (5):', sample.map(p => ({ id: p.id, name: p.name, type: p.type, tags: p.tags })));
        } catch (_) {}
    }, [environments, baseList]);

    // Debug: test filter matching when selectedEnv changes
    React.useEffect(() => {
        if (!selectedEnv) return;
        try {
            const normalize = (s: any) => String(s || '').trim().toLowerCase();
            const sel = normalize(selectedEnv);
            const matches = baseList.filter(p => {
                if (normalize(p.type) === sel) return true;
                if (Array.isArray(p.tags)) {
                    for (const tg of p.tags) if (normalize(tg) === sel) return true;
                }
                return false;
            });
            console.log(`[PlaceListPage] selectedEnv="${selectedEnv}" normalized="${sel}" matches=${matches.length} samples=[${matches.slice(0,3).map(p=>`${p.id}:${p.name}`).join(', ')}]`);
        } catch (e) { console.error('Debug filter error:', e); }
    }, [selectedEnv, baseList]);

    // Ordenação
    const sortedPlaces = useMemo(() => {
        const arr = [...filteredPlacesWithOpenNow];
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
    }, [filteredPlacesWithOpenNow, order, orderVersion]);


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
                                <SectionHeading title={title} underline={false} sizeClass="text-lg sm:text-2xl text-black" />
                                <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{subtitle}</p>
                            </div>
                        </div>
                    </div>
                    {/* Grid de tipos de ambiente */}
                    {environments.length > 0 && (
                        <div className="bg-[#F5F5F5] text-black pb-4">
                            <h3 className="font-bold text-lg mb-3 pt-8">{t('placeList.environmentTitle') || 'Tipo de ambiente:'}</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-xs w-full">
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
            {/* Barra de filtros: ícone à esquerda e menus à direita */}
            <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F5F5F5]">
                <div className="mx-auto max-w-5xl px-4 sm:px-12 py-4 text-black">
                    <div className="flex flex-col justify-start gap-2">
                        {/* Heading: icon + label styled like 'Tipo de ambiente:' */}
                        <div className="flex items-center">
                            <h3 className="font-bold text-lg text-black">{t('filters.title', { defaultValue: 'Filtros' })}</h3>
                        </div>
                        {/* Botões abaixo do título (nova linha) */}
                        <div className="flex items-center gap-2">
                            <img src={icFilter} alt="filter" className="w-5 h-5 mr-3 self-center" />
                            {/* Ordenação */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                                    style={{ background: '#F5F5F5', borderColor: '#403E44', color: '#0F0D13' }}
                                    onClick={() => { setShowSortingMenu((v) => !v); setShowHoursMenu(false); }}
                                >
                                    <span className="mr-2">{t('filters.sortingTitle')}</span>
                                    <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                                </button>
                                {showSortingMenu && (
                                    <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
                                        {ORDER_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${order === opt.value ? 'font-semibold' : ''}`}
                                                onClick={() => { setOrder(opt.value); setOrderVersion(x => x + 1); setShowSortingMenu(false); setFilterOpenNow(false); }}
                                            >
                                                {opt.value === 'name-asc' && t('list.orderNameAsc')}
                                                {opt.value === 'name-desc' && t('list.orderNameDesc')}
                                                {opt.value === 'neighborhood-asc' && t('list.orderNeighborhoodAsc')}
                                                {opt.value === 'neighborhood-desc' && t('list.orderNeighborhoodDesc')}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Horários */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                                    style={{ background: '#F5F5F5', borderColor: '#403E44', color: '#0F0D13' }}
                                    onClick={() => { setShowHoursMenu((v) => !v); setShowSortingMenu(false); }}
                                >
                                    <span className="mr-2">{t('filters.hoursTitle')}</span>
                                    <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                                </button>
                                {showHoursMenu && (
                                    <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-300 rounded shadow-lg z-10">
                                        <button
                                            type="button"
                                            className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${filterOpenNow ? 'font-semibold' : ''}`}
                                            onClick={() => { setFilterOpenNow(true); setOrder(''); setOrderVersion(x => x + 1); setShowHoursMenu(false); }}
                                        >
                                            {t('filters.openNowLabel')}
                                        </button>
                                        <button
                                            type="button"
                                            className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${!filterOpenNow ? 'font-semibold' : ''}`}
                                            onClick={() => { setFilterOpenNow(false); setOrderVersion(x => x + 1); setShowHoursMenu(false); }}
                                        >
                                            {t('filters.anyHourLabel', { defaultValue: 'Qualquer horário' })}
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Agendar */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                                    style={{ background: '#F5F5F5', borderColor: '#403E44', color: '#0F0D13' }}
                                    onClick={() => { setShowScheduleMenu((v) => !v); setShowSortingMenu(false); setShowHoursMenu(false); setShowCityMenu(false); setShowPriceMenu(false); }}
                                >
                                    <span className="mr-2">{t('filters.scheduleTitle', { defaultValue: 'Agendar' })}</span>
                                    <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                                </button>
                                {showScheduleMenu && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-300 rounded shadow-lg z-10">
                                        <button type="button" className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${scheduleFilter === 'required' ? 'font-semibold' : ''}`} onClick={() => { setScheduleFilter('required'); setShowScheduleMenu(false); }}>{t('filters.scheduleRequired', { defaultValue: 'Necessário agendar' })}</button>
                                        <button type="button" className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${scheduleFilter === 'not-required' ? 'font-semibold' : ''}`} onClick={() => { setScheduleFilter('not-required'); setShowScheduleMenu(false); }}>{t('filters.scheduleNotRequired', { defaultValue: 'Não precisa agendar' })}</button>
                                        <button type="button" className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${scheduleFilter === 'any' ? 'font-semibold' : ''}`} onClick={() => { setScheduleFilter('any'); setShowScheduleMenu(false); }}>{t('filters.anySchedule', { defaultValue: 'Qualquer' })}</button>
                                    </div>
                                )}
                            </div>
                            {/* Cidade (se aplicável) */}
                            {cities.length > 1 && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                                        style={{ background: '#F5F5F5', borderColor: '#403E44', color: '#0F0D13' }}
                                        onClick={() => { setShowCityMenu((v) => !v); setShowSortingMenu(false); setShowHoursMenu(false); setShowScheduleMenu(false); setShowPriceMenu(false); }}
                                    >
                                        <span className="mr-2">{t('filters.cityTitle', { defaultValue: 'Cidade' })}</span>
                                        <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                                    </button>
                                    {showCityMenu && (
                                        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-auto">
                                            <button type="button" className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${!cityFilter ? 'font-semibold' : ''}`} onClick={() => { setCityFilter(null); setShowCityMenu(false); }}>{t('filters.anyCity', { defaultValue: 'Qualquer cidade' })}</button>
                                            {cities.map(c => (
                                                <button key={c} type="button" className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${cityFilter === c ? 'font-semibold' : ''}`} onClick={() => { setCityFilter(c); setShowCityMenu(false); }}>{c}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                )}
                                {/* Preço (se aplicável) */}
                                {priceOptions.length > 1 && (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                                            style={{ background: '#F5F5F5', borderColor: '#403E44', color: '#0F0D13' }}
                                            onClick={() => { /* toggle price menu */ setShowPriceMenu((v)=>!v); setShowSortingMenu(false); setShowHoursMenu(false); setShowScheduleMenu(false); setShowCityMenu(false); }}
                                        >
                                            <span className="mr-2">{t('filters.priceTitle', { defaultValue: 'Preço' })}</span>
                                            <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                                        </button>
                                        {showPriceMenu && (
                                            <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-auto">
                                                <button type="button" className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${!priceFilter ? 'font-semibold' : ''}`} onClick={() => { setPriceFilter(null); setShowPriceMenu(false); }}>{t('filters.anyPrice', { defaultValue: 'Qualquer preço' })}</button>
                                                                                                {priceOptions.map(p => (
                                                                                                        <button
                                                                                                            key={p}
                                                                                                            type="button"
                                                                                                            className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${priceFilter === p ? 'font-semibold' : ''}`}
                                                                                                            onClick={() => { setPriceFilter(p); setShowPriceMenu(false); }}
                                                                                                        >
                                                                                                            {getPriceRangeLabel(p as any)}
                                                                                                        </button>
                                                                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal antigo de filtros removido em favor dos menus inline */}
            {/* Lista de lugares */}
            <section className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] flex-1 shadow-lg`}>
                <div className="mx-auto max-w-5xl px-0 sm:px-12">
                    <div className="rounded-t-lg overflow-hidden" key={`list-${selectedEnv || 'all'}-${order}-${orderVersion}`}>
                        <div className="flex bg-bs-card text-[#F5F5F5] font-bold text-lg sm:text-[20px] leading-tight border-b-2 border-bs-red">
                            <div className="w-1/3 px-2 sm:px-6 py-3">{t('list.nameHeader')}</div>
                            <div className={'w-1/4 py-3 ps-4 sm:ps-6'}>{t('list.neighborhoodHeader')}</div>
                            <div className="w-1/6 py-3 ps-2">{t('placeList.opensAtHeader', { defaultValue: 'Abertura' })}</div>
                        </div>
                        {sortedPlaces.length === 0 && <div className="p-4 text-gray-400">{t('common.noPlaces')}</div>}
                        {sortedPlaces.map((place, idx) => {
                            console.log('[PlaceListPage LIST MAP] rendering place id:', place.id, 'name:', place.name, 'total in sortedPlaces:', sortedPlaces.length);
                            const rowBg = idx % 2 === 0 ? 'bg-[#403E44]' : 'bg-[#48464C]';
                            return (
                                <div
                                    key={`${place.id}-${selectedEnv || 'all'}`}
                                    className={`flex items-center ${rowBg} px-4 sm:px-4 border-b border-bs-bg text-sm sm:text-base text-[#F5F5F5]`}
                                >
                                    <div className="w-1/3 px-2 py-6">{place.name}</div>
                                    <div className={'w-1/4 px-4 py-6'}>{getPlaceNeighborhood(place) || ((!place.addresses || place.addresses.length === 0) ? t('list.variablePlace') : "")}</div>
                                    <div className="w-1/6 px-4 py-6 text-sm text-gray-200">
                                        {(place.openingHours.patternId === 'CHECK_AVAILABILITY_DAYTIME') ? (
                                            <span className="text-sm text-gray-200">
                                                {t('openingHours.checkAvailabilityLabel')}
                                            </span>
                                        ) : getOpeningDisplayForToday(place)}
                                    </div>
                                    <div className="flex-1 flex justify-end">
                                        <ActionButton
                                            onClick={() => {
                                                const typeToSlug: Record<string, string> = {
                                                    RESTAURANTS: "restaurants",
                                                    BARS: "bars",
                                                    COFFEES: "coffees",
                                                    NIGHTLIFE: "nightlife",
                                                    NATURE: "nature",
                                                    TOURIST_SPOT: "tourist-spot",
                                                    PLEASURE: "pleasure",
                                                };
                                                // Use the actual place.type when available (fixes 'Abrem hoje' mixed lists)
                                                const placeTypeKey = place.type || mappedType;
                                                const slug = typeToSlug[placeTypeKey] || routeTypeLower;
                                                navigate(`/${slug}/${slugify(place.name)}`);
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
