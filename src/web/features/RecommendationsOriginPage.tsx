import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';

export function RecommendationsOriginPage() {
    const { t } = useTranslation();
    return (
        <main>
            <SectionHeading title={t('recommendationsOrigin.title')} underline={false} sizeClass="text-2xl" />
        </main>
    );
}