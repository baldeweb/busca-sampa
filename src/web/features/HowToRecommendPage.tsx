import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';

export function HowToRecommendPage() {
    const { t } = useTranslation();
    return (
        <main>
            <SectionHeading title={t('howToRecommend.title')} underline={false} sizeClass="text-2xl" />
        </main>
    );
}