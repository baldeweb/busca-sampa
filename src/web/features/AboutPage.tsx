import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';

export function AboutPage() {
    const { t } = useTranslation();
    return (
        <main>
            <SectionHeading title={t('about.title')} underline={false} sizeClass="text-2xl" />
            <p>{t('about.paragraph')}</p>
        </main>
    );
}