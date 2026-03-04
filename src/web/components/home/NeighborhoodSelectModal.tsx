import type { Neighborhood } from "@/core/domain/models/Neighborhood";
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { AppButton } from "../ui/AppButton";
import { AppText } from "../ui/AppText";

interface Props {
    neighborhoods: Neighborhood[];
    onClose: () => void;
    onSelect: (neighborhood: Neighborhood) => void;
}

export function NeighborhoodSelectModal({
    neighborhoods,
    onClose,
    onSelect,
}: Props) {
    function handleSelect(n: Neighborhood) {
        onSelect(n);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
            <div className="w-[90%] max-w-sm rounded-md border border-white/15 bg-bs-card shadow-xl">
                {/* Cabeçalho */}
                <div className="px-4 py-3">
                    <div className="mb-1 flex items-center justify-between">
                        <SectionHeading title={"Selecione um bairro"} underline={false} className="flex-1" card={false} tone="dark" />
                        <AppButton
                            variant="close"
                            type="button"
                            onClick={onClose}
                            aria-label="Fechar"
                        >
                            ×
                        </AppButton>
                    </div>
                    <div className="h-[3px] w-24 bg-bs-red" />
                </div>

                {/* Lista de bairros */}
                <ul className="max-h-[60vh] overflow-y-auto py-2">
                    {neighborhoods.map((n) => (
                        <li key={n.id}>
                            <AppButton
                                variant="square"
                                onClick={() => handleSelect(n)}
                                className={`flex w-full items-center justify-between px-4 py-2`}
                            >
                                <AppText variant="subtitle-light">{n.neighborhoodName}</AppText>
                                <AppText variant="subtitle-light" className="opacity-70">{">"}</AppText>
                            </AppButton>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
