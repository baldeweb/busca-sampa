import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';

interface Props {
    initialKm?: number;
    onClose: () => void;
    onConfirm: (km: number) => void;
}

export function DistanceSelectModal({
    initialKm = 3,
    onClose,
    onConfirm,
}: Props) {
    const [km, setKm] = useState(initialKm);
    const { t } = useTranslation();

    function increment() {
        if (km < 50) setKm(km + 1);
    }

    function decrement() {
        if (km > 1) setKm(km - 1);
    }

    function confirm() {
        onConfirm(km);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
            <div className="w-[90%] max-w-sm rounded-md border border-white/15 bg-bs-card text-white shadow-xl">
                {/* HEADER */}
                <div className="px-4 py-3">
                    <div className="mb-2 flex items-center justify-between">
                        <SectionHeading title={t('distanceSelect.title')} underline={false} sizeClass="text-sm" trackingClass="tracking-[0.18em]" className="flex-1" />

                        <button
                            type="button"
                            onClick={onClose}
                            className="text-lg font-bold leading-none hover:text-bs-red"
                        >
                            ×
                        </button>
                    </div>

                    <div className="h-[3px] w-full bg-bs-red" />
                </div>

                {/* CONTROLES */}
                <div className="flex items-center justify-around py-4 sm:py-6">
                    <button
                        onClick={decrement}
                        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-white/25 bg-bs-bg hover:border-bs-red"
                    >
                        -
                    </button>

                    <div className="text-2xl sm:text-3xl font-bold">{km}</div>

                    <button
                        onClick={increment}
                        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-white/25 bg-bs-bg hover:border-bs-red"
                    >
                        +
                    </button>
                </div>

                {/* BOTÃO CONFIRMAR */}
                <div className="px-4 pb-4">
                    <button
                        type="button"
                        onClick={confirm}
                        className="w-full rounded-md bg-bs-red px-4 py-2 text-center text-sm font-bold uppercase tracking-[0.18em] hover:bg-bs-red/80"
                    >
                        {t('distanceSelect.searchButton')}
                    </button>
                </div>
            </div>
        </div>
    );
}
