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
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    function updateArrows() {
        if (!listRef.current) return;
        const el = listRef.current;
        setShowLeft(el.scrollLeft > 8);
        setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }

    // Inicializa listeners de scroll/resize
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const handler = () => updateArrows();
        el.addEventListener("scroll", handler);
        window.addEventListener("resize", handler);
        updateArrows();
        return () => {
            el.removeEventListener("scroll", handler);
            window.removeEventListener("resize", handler);
        };
    }, []);

    // Recalcula quando opções são carregadas
    useEffect(() => {
        updateArrows();
    }, [options.length, loading]);

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

    function scrollByAmount(dir: 1 | -1) {
        if (!listRef.current) return;
        const scrollAmount = 140;
        listRef.current.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
    }

    const { t } = useTranslation();
    return (
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#48464C] py-6 sm:py-12">
            <div className="mx-auto max-w-5xl px-4 sm:px-4">
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
                        className="flex flex-nowrap gap-2 overflow-x-auto py-3 px-4 sm:px-12 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none scroll-smooth"
                        role="listbox"
                        aria-label="Categorias"
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                    >
                        <style>{`.flex.flex-nowrap::-webkit-scrollbar{display:none}`}</style>
                        {options.map((option, idx) => (
                            <CategoryCard
                                key={option.id}
                                label={option.title}
                                icon={resolveIcon(option.tags)}
                                selected={option.id === selectedId}
                                onClick={() => handleClick(option)}
                                index={idx}
                            />
                        ))}
                    </div>
                    {/* Setas laterais fora da área dos cards */}
                    {showLeft && (
                        <button
                            type="button"
                            aria-label="Ver categorias anteriores"
                            onClick={() => scrollByAmount(-1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-bs-card/80 backdrop-blur px-2 py-2 rounded-full border border-white/20 hover:border-bs-red text-white text-sm shadow transition-colors"
                        >
                            ◀
                        </button>
                    )}
                    {showRight && (
                        <button
                            type="button"
                            aria-label="Ver próximas categorias"
                            onClick={() => scrollByAmount(1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-bs-card/80 backdrop-blur px-2 py-2 rounded-full border border-white/20 hover:border-bs-red text-white text-sm shadow transition-colors"
                        >
                            ▶
                        </button>
                    )}
                </div>
            )}
            </div>
        </section>
    );
}
