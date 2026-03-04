import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../ui/AppButton';
import { AppText } from '../ui/AppText';

interface EnvironmentOption {
    label: string;
    value: string;
}

interface Props {
    environments: EnvironmentOption[];
    onClose: () => void;
    onSelect: (environment: EnvironmentOption | null) => void;
    excludedValues?: string[];
}

export function EnvironmentSelectModal({
    environments,
    onClose,
    onSelect,
    excludedValues,
}: Props) {
    const { t } = useTranslation();
    const heading = t('placeList.environmentTitle', { defaultValue: 'Tipos de ambiente' });
    function handleSelect(env: EnvironmentOption | null) {
        onSelect(env);
        onClose();
    }

    const shownEnvironments = environments.filter(e => !excludedValues?.includes(e.value));

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-[90%] max-w-sm rounded-md border border-white/15 bg-bs-card text-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div className="px-4 py-3">
                    <div className="mb-1 flex items-center justify-between">
                        <SectionHeading title={heading} underline={false} className="flex-1" card={false} tone='dark' />
                        <AppButton
                            variant="close"
                            type="button"
                            onClick={onClose}
                            aria-label={t('common.close', { defaultValue: 'Fechar' })}
                        >
                            ×
                        </AppButton>
                    </div>
                    <div className="h-[3px] w-24 bg-bs-red" />
                </div>

                {/* Lista de tipos */}
                <ul className="max-h-[60vh] overflow-y-auto py-2">
                    {/* Opção "Todos" */}
                    <li>
                        <AppButton
                            variant="square"
                            onClick={() => handleSelect(null)}
                            className={`flex w-full items-center justify-between px-4 py-2`}
                        >
                            <AppText variant="subtitle-light" className="category-card-label">{t('common.all')}</AppText>
                            <AppText variant="subtitle-light" className="opacity-70">{">"}</AppText>
                        </AppButton>
                    </li>
                    {shownEnvironments.map((env) => (
                        <li key={env.value}>
                            <AppButton
                                variant="square"
                                onClick={() => handleSelect(env)}
                                className={`flex w-full items-center justify-between px-4 py-2`}>
                                <AppText variant="subtitle-light" className="category-card-label">{env.label}</AppText>
                                <AppText variant="subtitle-light" className="opacity-70">{">"}</AppText>
                            </AppButton>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
