import { useState, type ReactElement } from "react";
import { useMenuWhereIsToday } from "@/web/hooks/useMenuWhereIsToday";
import type { MenuWhereIsTodayOption } from "@/core/domain/models/MenuWhereIsTodayOption";
import { SectionHeading } from "@/web/components/ui/SectionHeading";
import { CategoryCard } from "@/web/components/ui/CategoryCard";
// icons replaced by project image assets
import icBars from '@/assets/imgs/icons/ic_bars.png';
import icCoffee from '@/assets/imgs/icons/ic_coffee.png';
import icFree from '@/assets/imgs/icons/ic_free.png';
import icNightlife from '@/assets/imgs/icons/ic_nightlife.png';
import icNature from '@/assets/imgs/icons/ic_nature.png';
import icRestaurants from '@/assets/imgs/icons/ic_restaurants.png';
import icTouristSpot from '@/assets/imgs/icons/ic_tourist_spot.png';
import icForfun from '@/assets/imgs/icons/ic_forfun.png';
import icStores from '@/assets/imgs/icons/ic_stores.png';
import icFlagSP from '@/assets/imgs/etc/logo-role-paulista.png';
import imgTheatro from '@/assets/imgs/background/img_theatro.jpg';
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
        const cls = "w-5 h-5 sm:w-7 sm:h-7 object-contain";
        // Todas as imagens do carrossel não podem ser arrastadas!
        const imgProps = { draggable: false, onDragStart: (e: React.DragEvent) => e.preventDefault() };
        const normalized = (tags || [])
            .map((t) => String(t || '').trim())
            .filter(Boolean)
            .map((t) => t.replace(/-/g, '_').toUpperCase());
        console.log('[PUDIM]: normalized > ', normalized);
        if (normalized.includes('OPEN_TODAY')) return <img src={icOpenToday} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('FREE')) return <img src={icFree} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('RESTAURANTS') || normalized.includes('RESTAURANT')) return <img src={icRestaurants} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('BARS')) return <img src={icBars} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('COFFEES') || normalized.includes('CAFETERIAS')) return <img src={icCoffee} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('NIGHTLIFE')) return <img src={icNightlife} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('NATURE')) return <img src={icNature} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('TOURIST_SPOT')) return <img src={icTouristSpot} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('FORFUN')) return <img src={icForfun} className={cls} alt="" {...imgProps} />;
        if (normalized.includes('STORES')) return <img src={icStores} className={cls} alt="" {...imgProps} />;
        return <img src={icFlagSP} className={cls} alt="" {...imgProps} />;
    }
    const { t } = useTranslation();
    return (
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-6 sm:py-12 overflow-hidden">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${imgTheatro})`, opacity: 0.2 }}
            />
            <div className="absolute inset-0 w-full h-full bg-[#48464C] z-10" style={{ opacity: 0.65 }} />
            <div className="relative z-20 mx-auto max-w-5xl pl-4 pr-0 pt-6 sm:pt-2">
                <SectionHeading title={t('whereIsToday.title')} underline={false} sizeClass="text-xl sm:text-2xl" className="mb-1" />
                <p className="mt-1 text-sm text-gray-300 max-w-2xl leading-relaxed">{t('whereIsToday.subtitle')}</p>
            {loading && <p className="text-base text-gray-300">{t('common.loading')}</p>}
            {error && (
                <p className="text-base text-red-400">{t('common.loadError')}</p>
            )}
            {!loading && !error && (
                <div className="relative mt-4">
                    <div
                        className="grid grid-cols-2 gap-2 py-3 pr-4 sm:pr-12 sm:[grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]"
                        role="listbox"
                        aria-label="Categorias"
                    >
                        {/* Static option: 'Abrem hoje' (opens today) */}
                        {(() => {
                            const raw = t('whereIsToday.opensToday', { defaultValue: 'Abrem hoje' });
                            return (
                                <CategoryCard
                                    key="opens-today"
                                    label={raw}
                                    icon={<img src={icOpenToday} className="w-5 h-5 sm:w-7 sm:h-7 object-contain" alt="" />}
                                    selected={selectedId === -999}
                                    onClick={() => {
                                        setSelectedId(-999);
                                        onOptionSelect?.({ id: -999, title: raw, tags: ['OPEN_TODAY'] } as any);
                                    }}
                                    index={0}
                                />
                            );
                        })()}
                        {(() => {
                            const opensTodayKey = (t('whereIsToday.opensToday') || 'Abrem hoje').toString().replace(/\u200B/g, '').trim().toLowerCase();
                            const filtered = options.filter(opt => {
                                const raw = (opt.title || '').replace(/\u200B/g, '').trim().toLowerCase();
                                // skip menu item that represents the 'Abrem hoje' synthetic option
                                if (raw === opensTodayKey) return false;
                                // also skip explicit OPEN_TODAY tag if present
                                if (opt.tags && opt.tags.includes('OPEN_TODAY')) return false;
                                return true;
                            });
                            return filtered.map((option, idx) => {
                            // normalize title (remove zero-width spaces)
                            const raw = (option.title || '').replace(/\u200B/g, '');

                            // translated label: prefer i18n keys (open now / placeType) when available
                            let translatedRaw: string;
                            if (option.tags && option.tags.includes('FREE')) {
                                translatedRaw = t('placeType.FREE');
                            } else {
                                // find first known tag and translate via getPlaceTypeLabel
                                const known = ['RESTAURANTS', 'RESTAURANT', 'BARS', 'COFFEES', 'NIGHTLIFE', 'NATURE', 'TOURIST_SPOT', 'FORFUN', 'STORES'];
                                const found = option.tags?.find((tg) => known.includes(tg));
                                translatedRaw = found ? getPlaceTypeLabel(found) : raw;
                            }

                            // convert to sentence case: first letter uppercase, rest lowercase
                            const sentence = (s: string) => {
                                if (!s) return s;
                                const trimmed = s.trim();
                                return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                            };

                            let label: React.ReactNode;
                            // Build label using the translated string but maintain forced breaks for known phrases
                            const translatedSentence = sentence(translatedRaw || '');
                            
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

                            console.log('[PUDIM]: label > ', label)
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
                        });
                    })()}
                    </div>
                </div>
            )}
            </div>
        </section>
    );
}
