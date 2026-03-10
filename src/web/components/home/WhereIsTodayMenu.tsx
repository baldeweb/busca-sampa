import { useState, type DragEvent, type ReactElement } from "react";
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
import icEvents from '@/assets/imgs/icons/ic_events.png';
import icFlagSP from '@/assets/imgs/etc/logo-role-paulista.png';
import imgTheatro640 from '@/assets/imgs/background/img_theatro_640.webp';
import imgTheatro1280 from '@/assets/imgs/background/img_theatro_1280.webp';
import { useTranslation } from 'react-i18next';
import icOpenToday from '@/assets/imgs/icons/ic_open_today.png';
import { getPlaceTypeLabel } from '@/core/domain/enums/placeTypeLabel';
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";
import { WhereIsTodayMoreModal } from "./WhereIsTodayMoreModal";

interface Props {
    onOptionSelect?: (option: MenuWhereIsTodayOption) => void;
}

export function WhereIsTodayMenu({ onOptionSelect }: Props) {
    const { data: options, loading, error } = useMenuWhereIsToday();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

    function handleClick(option: MenuWhereIsTodayOption) {
        setSelectedId(option.id);
        onOptionSelect?.(option);
    }

    // Map tag/title to project icons in `src/assets/imgs/icons`
    function normalizeTags(tags: string[]): string[] {
        return (tags || [])
            .map((t) => String(t || '').trim())
            .filter(Boolean)
            .map((t) => t.replace(/-/g, '_').toUpperCase());
    }

    function resolveIcon(tags: string[]): ReactElement {
        const cls = "w-5 h-5 sm:w-7 sm:h-7 object-contain";
        const size = 28;
        // Todas as imagens do carrossel não podem ser arrastadas!
        const imgProps = { draggable: false, onDragStart: (e: DragEvent) => e.preventDefault(), width: size, height: size, decoding: 'async' as const };
        const normalized = normalizeTags(tags);
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
        if (normalized.includes('EVENTS')) return <img src={icEvents} className={cls} alt="" {...imgProps} />;
        return <img src={icFlagSP} className={cls} alt="" {...imgProps} />;
    }

    function getTranslatedLabel(option: MenuWhereIsTodayOption): string {
        const raw = (option.title || '').replace(/\u200B/g, '').trim();
        const known = ['RESTAURANTS', 'RESTAURANT', 'BARS', 'COFFEES', 'NIGHTLIFE', 'NATURE', 'TOURIST_SPOT', 'FORFUN', 'STORES', 'EVENTS'];
        const normalized = normalizeTags(option.tags || []);

        if (normalized.includes('FREE')) return t('placeType.FREE');

        const found = normalized.find((tag) => known.includes(tag));
        return found ? getPlaceTypeLabel(found) : raw;
    }

    const { t } = useTranslation();

    const opensTodayRaw = t('whereIsToday.opensToday', { defaultValue: 'Abrem hoje' });
    const opensTodayKey = opensTodayRaw.toString().replace(/\u200B/g, '').trim().toLowerCase();

    const filteredOptions = options.filter((option) => {
        const raw = (option.title || '').replace(/\u200B/g, '').trim().toLowerCase();
        const normalized = normalizeTags(option.tags || []);
        if (raw === opensTodayKey) return false;
        if (normalized.includes('OPEN_TODAY')) return false;
        return true;
    });

    const findOptionByTag = (wantedTag: string): MenuWhereIsTodayOption | null => {
        const normalizedWanted = wantedTag.toUpperCase();
        return filteredOptions.find((option) => normalizeTags(option.tags || []).includes(normalizedWanted)) || null;
    };

    const fallbackOptionByTag = (tag: string, id: number): MenuWhereIsTodayOption => ({
        id,
        isEnabled: true,
        title: getPlaceTypeLabel(tag),
        tags: [tag],
    });

    const primaryTags = ['FREE', 'RESTAURANTS', 'BARS', 'NIGHTLIFE', 'COFFEES', 'NATURE', 'TOURIST_SPOT', 'FORFUN'];
    const primaryOptions = primaryTags
        .map((tag) => findOptionByTag(tag))
        .filter((item): item is MenuWhereIsTodayOption => Boolean(item));

    const moreOptions = [
        findOptionByTag('STORES') || fallbackOptionByTag('STORES', -1001),
        findOptionByTag('EVENTS') || fallbackOptionByTag('EVENTS', -1002),
    ];

    return (
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen pt-6 pb-12 sm:pt-10 sm:pb-14 overflow-hidden">
            <img
                src={imgTheatro1280}
                srcSet={`${imgTheatro640} 640w, ${imgTheatro1280} 1280w`}
                sizes="100vw"
                alt=""
                aria-hidden="true"
                decoding="async"
                loading="eager"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-20"
            />
            <div className="absolute inset-0 w-full h-full bg-[#212121] z-10" style={{ opacity: 0.65 }} />
            <div className="relative z-20 mx-auto max-w-5xl pl-4 pr-0 pt-6 sm:pt-2">
                <SectionHeading title={t('whereIsToday.title')} subtitle={t('whereIsToday.subtitle')} className="mt-1 mb-1 max-w-2xl" underline={false} card={false} tone="dark" />
            {loading && <AppText variant="subtitle-dark">{t('common.loading')}</AppText>}
            {error && (<AppText variant="subtitle-dark">{t('common.loadError')}</AppText>)}
            {!loading && !error && (
                <div className="relative mt-4">
                    <div
                        className="grid grid-cols-2 gap-2 py-3 pr-4 sm:pr-12 sm:[grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]"
                        role="listbox"
                        aria-label={t('whereIsToday.categoriesAriaLabel', { defaultValue: 'Categorias' })}
                    >
                        <CategoryCard
                            key="opens-today"
                            label={opensTodayRaw}
                            icon={<img src={icOpenToday} className="w-5 h-5 sm:w-7 sm:h-7 object-contain" alt="" width={28} height={28} decoding="async" />}
                            selected={selectedId === -999}
                            onClick={() => {
                                setSelectedId(-999);
                                onOptionSelect?.({ id: -999, title: opensTodayRaw, tags: ['OPEN_TODAY'], isEnabled: true });
                            }}
                            index={0}
                        />
                        {primaryOptions.map((option, idx) => {
                            const translatedLabel = getTranslatedLabel(option);
                            const parts = translatedLabel.split(/\s+/).filter(Boolean);
                            const label = (
                                <>
                                    {parts.map((part, partIndex) => (
                                        <span key={partIndex} className="whitespace-normal">
                                            {part}
                                            {partIndex < parts.length - 1 && <wbr />}
                                            {partIndex < parts.length - 1 ? ' ' : ''}
                                        </span>
                                    ))}
                                </>
                            );

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
                        <AppButton
                            variant="seemore"
                            className="w-full px-4 py-4"
                            onClick={() => setIsMoreModalOpen(true)}
                        >
                            VER MAIS
                        </AppButton>
                    </div>
                </div>
            )}
            </div>
            {isMoreModalOpen && (
                <WhereIsTodayMoreModal
                    options={moreOptions}
                    onClose={() => setIsMoreModalOpen(false)}
                    onSelect={(option) => handleClick(option)}
                    resolveIcon={resolveIcon}
                    getLabel={getTranslatedLabel}
                />
            )}
        </section>
    );
}
