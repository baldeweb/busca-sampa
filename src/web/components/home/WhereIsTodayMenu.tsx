import { useRef, useState, type ReactElement } from "react";
import { useMenuWhereIsToday } from "@/web/hooks/useMenuWhereIsToday";
import type { MenuWhereIsTodayOption } from "@/core/domain/models/MenuWhereIsTodayOption";
import { SectionHeading } from "@/web/components/ui/SectionHeading";
import { CategoryCard } from "@/web/components/ui/CategoryCard";
// icons replaced by project image assets
import icBars from '@/assets/imgs/icons/ic_bars.png';
import icCoffee from '@/assets/imgs/icons/ic_coffee.png';
import icDoorOpened from '@/assets/imgs/icons/ic_door_opened.png';
import icFree from '@/assets/imgs/icons/ic_free.png';
import icNightlife from '@/assets/imgs/icons/ic_nightlife.png';
import icNature from '@/assets/imgs/icons/ic_nature.png';
import icRestaurants from '@/assets/imgs/icons/ic_restaurants.png';
import icTouristSpot from '@/assets/imgs/icons/ic_tourist_spot.png';
import icCalendar from '@/assets/imgs/icons/ic_door_opened.png';
import { useTranslation } from 'react-i18next';
import icOpenToday from '@/assets/imgs/icons/ic_open_today.png';
import { getPlaceTypeLabel } from '@/core/domain/enums/placeTypeLabel';

interface Props {
    onOptionSelect?: (option: MenuWhereIsTodayOption) => void;
}

export function WhereIsTodayMenu({ onOptionSelect }: Props) {
    const { data: options, loading, error } = useMenuWhereIsToday();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    function handleClick(option: MenuWhereIsTodayOption) {
        setSelectedId(option.id);
        onOptionSelect?.(option);
    }

    // Map tag/title to project icons in `src/assets/imgs/icons`
    function resolveIcon(tags: string[]): ReactElement {
        const cls = "w-10 h-10 sm:w-14 sm:h-14 object-contain";
        // detect 'Aberto agora' by tags aggregate (first menu option has many tags)
        if (tags && tags.length > 1) return <img src={icDoorOpened} className={cls} alt="" />;
        if (tags.includes('FREE')) return <img src={icFree} className={cls} alt="" />;
        if (tags.includes('RESTAURANTS') || tags.includes('RESTAURANT')) return <img src={icRestaurants} className={cls} alt="" />;
        if (tags.includes('BAR') || tags.includes('BARS')) return <img src={icBars} className={cls} alt="" />;
        if (tags.includes('COFFEE') || tags.includes('COFFEES') || tags.includes('CAFETERIAS')) return <img src={icCoffee} className={cls} alt="" />;
        // specific icons
        if (tags.includes('NIGHTLIFE')) return <img src={icNightlife} className={cls} alt="" />;
        if (tags.includes('NATURE')) return <img src={icNature} className={cls} alt="" />;
        if (tags.includes('TOURIST_SPOT')) return <img src={icTouristSpot} className={cls} alt="" />;
        return <img src={icRestaurants} className={cls} alt="" />;
    }

    const listRef = useRef<HTMLDivElement | null>(null);

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (!listRef.current) return;
        const scrollAmount = 140; // approximate card width + gap
        if (e.key === "ArrowRight") {
            e.preventDefault();
            listRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            listRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    }

    const { t } = useTranslation();
    return (
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] py-6 sm:py-12">
                <div className="mx-auto max-w-5xl pl-4 pr-0">
                <SectionHeading title={t('whereIsToday.title')} underline={false} sizeClass="text-xl sm:text-2xl" className="mb-1" />
                <p className="mt-1 text-sm text-gray-300 max-w-2xl leading-relaxed">{t('whereIsToday.subtitle')}</p>
            {loading && <p className="text-base text-gray-300">{t('common.loading')}</p>}
            {error && (
                <p className="text-base text-red-400">{t('common.loadError')}</p>
            )}
            {!loading && !error && (
                <div className="relative mt-4">
                    <div
                        ref={listRef}
                        className="flex flex-nowrap gap-2 overflow-x-auto py-3 pl-4 pr-0 sm:px-12 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none scroll-smooth"
                        role="listbox"
                        aria-label="Categorias"
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                    >
                        <style>{`.flex.flex-nowrap::-webkit-scrollbar{display:none}`}</style>
                        {/* Static option: 'Abrem hoje' (opens today) */}
                        {(() => {
                            const raw = t('whereIsToday.opensToday', { defaultValue: 'Abrem hoje' });
                            const parts = (raw || '').trim().split(/\s+/);
                            const labelNode = parts.length > 1 ? (
                                <>
                                    <span className="block whitespace-normal">{parts[0]}</span>
                                    <span className="block whitespace-normal">{parts.slice(1).join(' ')}</span>
                                </>
                            ) : raw;
                            return (
                                <CategoryCard
                                    key="opens-today"
                                    label={labelNode}
                                    icon={<img src={icOpenToday} className="w-10 h-10 sm:w-14 sm:h-14 object-contain" alt="" />}
                                    selected={selectedId === -999}
                                    onClick={() => {
                                        setSelectedId(-999);
                                        onOptionSelect?.({ id: -999, title: raw, tags: ['OPEN_TODAY'] } as any);
                                    }}
                                    index={0}
                                />
                            );
                        })()}
                        {options.map((option, idx) => {
                            // normalize title (remove zero-width spaces)
                            const raw = (option.title || '').replace(/\u200B/g, '');
                            const lower = raw.toLowerCase();

                            // translated label: prefer i18n keys (open now / placeType) when available
                            let translatedRaw: string;
                            if (lower.includes('aberto') || (option.tags && option.tags.length > 1)) {
                                translatedRaw = t('placeDetail.openNow');
                            } else if (option.tags && option.tags.includes('FREE')) {
                                translatedRaw = t('placeType.FREE');
                            } else {
                                // find first known tag and translate via getPlaceTypeLabel
                                const known = ['RESTAURANTS', 'RESTAURANT', 'BAR', 'BARS', 'COFFEE', 'COFFEES', 'NIGHTLIFE', 'NATURE', 'TOURIST_SPOT'];
                                const found = option.tags?.find((tg) => known.includes(tg));
                                translatedRaw = found ? getPlaceTypeLabel(found) : raw;
                            }

                            // titles we want to force-break into two lines
                            const forceBreakKeys = new Set([
                                'aberto agora',
                                'vida noturna',
                                'pontos turísticos',
                                'pontos turisticos'
                            ]);

                            // convert to sentence case: first letter uppercase, rest lowercase
                            const sentence = (s: string) => {
                                if (!s) return s;
                                const trimmed = s.trim();
                                return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                            };

                            let label: React.ReactNode;
                            // Build label using the translated string but maintain forced breaks for known phrases
                            const translatedLower = (translatedRaw || '').toLowerCase();
                            const translatedSentence = sentence(translatedRaw || '');
                            if (forceBreakKeys.has(lower) || forceBreakKeys.has(translatedLower)) {
                                const firstSpace = translatedSentence.indexOf(' ');
                                if (firstSpace > -1) {
                                    const a = translatedSentence.slice(0, firstSpace);
                                    const b = translatedSentence.slice(firstSpace + 1);
                                    label = (
                                        <>
                                            <span className="block whitespace-normal">{a}</span>
                                            <span className="block whitespace-normal">{b}</span>
                                        </>
                                    );
                                } else {
                                    label = translatedSentence;
                                }
                            } else {
                                const parts = translatedSentence.split(/\s+/).filter(Boolean);
                                label = (
                                    <>
                                        {parts.map((p, i) => (
                                            <span key={i} className="whitespace-normal">
                                                {p}
                                                {i < parts.length - 1 && <wbr />}
                                                {i < parts.length - 1 ? ' ' : ''}
                                            </span>
                                        ))}
                                    </>
                                );
                            }

                            return (
                                    <CategoryCard
                                        key={option.id}
                                        label={label}
                                        icon={resolveIcon(option.tags)}
                                        selected={option.id === selectedId}
                                        onClick={() => handleClick(option)}
                                        index={idx + 1}
                                    />
                            );
                        })}
                    </div>
                    {/* Right gradient overlay to indicate more items to scroll */}
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#48464C] to-transparent" />
                </div>
            )}
            </div>
        </section>
    );
}
