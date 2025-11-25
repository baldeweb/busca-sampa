import { useEffect, useRef, useState, type ReactElement } from "react";
import { useMenuWhereIsToday } from "@/web/hooks/useMenuWhereIsToday";
import type { MenuWhereIsTodayOption } from "@/core/domain/models/MenuWhereIsTodayOption";
import { SectionHeading } from "@/web/components/ui/SectionHeading";
import { CategoryCard } from "@/web/components/ui/CategoryCard";
import { FaHamburger, FaBeer, FaCoffee, FaTree } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { FaLandmark } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

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

    // Map tag to icon component (placeholder icons; will be replaced later)
    function resolveIcon(tags: string[]): ReactElement {
        const base = { className: "" };
        if (tags.includes("RESTAURANTS")) return <FaHamburger {...base} />;
        if (tags.includes("BARS")) return <FaBeer {...base} />;
        if (tags.includes("NIGHTLIFE")) return <GiPartyPopper {...base} />;
        if (tags.includes("COFFEES") || tags.includes("CAFETERIAS")) return <FaCoffee {...base} />;
        if (tags.includes("TOURIST_SPOT")) return <FaLandmark {...base} />;
        if (tags.includes("NATURE")) return <FaTree {...base} />;
        return <FaHamburger {...base} />; // fallback
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
                        {options.map((option, idx) => {
                            // normalize title (remove zero-width spaces)
                            const raw = (option.title || '').replace(/\u200B/g, '');
                            const lower = raw.toLowerCase();

                            // titles we want to force-break into two lines
                            const forceBreakKeys = new Set([
                                'aberto agora',
                                'vida noturna',
                                'pontos turísticos',
                                'pontos turisticos'
                            ]);

                            let label: React.ReactNode;
                            if (forceBreakKeys.has(lower)) {
                                const firstSpace = raw.indexOf(' ');
                                if (firstSpace > -1) {
                                    const a = raw.slice(0, firstSpace);
                                    const b = raw.slice(firstSpace + 1);
                                    label = (
                                        <>
                                            <span className="block whitespace-normal">{a}</span>
                                            <span className="block whitespace-normal">{b}</span>
                                        </>
                                    );
                                } else {
                                    label = raw;
                                }
                            } else {
                                const parts = raw.split(/\s+/).filter(Boolean);
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
                                    index={idx}
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
