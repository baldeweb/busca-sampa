import { SectionHeading } from '@/web/components/ui/SectionHeading';

interface EnvironmentOption {
    label: string;
    value: string;
}

interface Props {
    environments: EnvironmentOption[];
    onClose: () => void;
    onSelect: (environment: EnvironmentOption | null) => void;
    selectedEnv: string | null;
    excludedValues?: string[];
}

export function EnvironmentSelectModal({
    environments,
    onClose,
    onSelect,
    selectedEnv,
    excludedValues,
}: Props) {
    function handleSelect(env: EnvironmentOption | null) {
        onSelect(env);
        onClose();
    }

    const shownEnvironments = environments.filter(e => !excludedValues?.includes(e.value));

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
            <div className="w-[90%] max-w-sm rounded-md border border-white/15 bg-bs-card text-white shadow-xl">
                {/* Cabeçalho */}
                <div className="px-4 py-3">
                    <div className="mb-1 flex items-center justify-between">
                        <SectionHeading title={"Tipos de ambiente"} underline={false} sizeClass="text-sm" trackingClass="tracking-[0.18em]" className="flex-1" />
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-lg font-bold leading-none hover:text-bs-red"
                        >
                            ×
                        </button>
                    </div>
                    <div className="h-[3px] w-24 bg-bs-red" />
                </div>

                {/* Lista de tipos */}
                <ul className="max-h-[60vh] overflow-y-auto py-2">
                    {/* Opção "Todos" */}
                    <li>
                        <button
                            type="button"
                            onClick={() => handleSelect(null)}
                            className={`flex w-full items-center justify-between px-4 py-2 text-base hover:bg-bs-red/70 ${
                                selectedEnv === null ? 'bg-bs-red/50' : ''
                            }`}
                        >
                            <span className="category-card-label">Todos</span>
                            <span className="text-sm opacity-70">{">"}</span>
                        </button>
                    </li>
                    {shownEnvironments.map((env) => (
                        <li key={env.value}>
                            <button
                                type="button"
                                onClick={() => handleSelect(env)}
                                className={`flex w-full items-center justify-between px-4 py-2 text-base hover:bg-bs-red/70 ${
                                    selectedEnv === env.value ? 'bg-bs-red/50' : ''
                                }`}
                            >
                                <span className="category-card-label">{env.label}</span>
                                <span className="text-sm opacity-70">{">"}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
